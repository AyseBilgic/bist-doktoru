import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLLECTAPI_KEY = process.env.COLLECTAPI_KEY || "";
const COLLECTAPI_BASE = "https://api.collectapi.com/economy";

// Yahoo Finance üzerinden BIST hisse fallback (CollectAPI yoksa)
const BIST_SYMBOLS = [
  "THYAO","GARAN","ASELS","EREGL","KCHOL","SISE","AKBNK","YKBNK","TUPRS","BIMAS",
  "FROTO","TOASO","PETKM","PGSUS","VESTL","KOZAL","TCELL","ENKAI","SAHOL","ISCTR",
  "ARCLK","KOZAA","MGROS","EKGYO","AEFES","TTKOM","DOHOL","HEKTS","ODAS","OYAKC",
  "TAVHL","SASA","TKFEN","BRISA","GUBRF","ULKER","CCOLA","KORDS","BAGFS","ANACM",
];

function fmtHacim(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K`;
  return String(v);
}

async function fetchStocksFromYahoo() {
  const ySymbols = BIST_SYMBOLS.map((s) => `${s}.IS`).join(",");
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${ySymbols}&lang=tr&region=TR`;
  const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!resp.ok) throw new Error(`Yahoo Finance error: ${resp.status}`);
  const json = await resp.json();
  const quotes: any[] = json?.quoteResponse?.result ?? [];
  const result = quotes.map((q) => ({
    code: String(q.symbol).replace(".IS", ""),
    text: q.longName || q.shortName || q.symbol,
    lastprice: q.regularMarketPrice ?? 0,
    lastpricestr: (q.regularMarketPrice ?? 0).toFixed(2),
    rate: q.regularMarketChangePercent ?? 0,
    hacim: q.regularMarketVolume ?? 0,
    hacimstr: fmtHacim(q.regularMarketVolume ?? 0),
  }));
  return { success: true, result };
}

async function fetchBistFromYahoo() {
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=XU100.IS&lang=tr&region=TR`;
  const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!resp.ok) throw new Error(`Yahoo Finance BIST error: ${resp.status}`);
  const json = await resp.json();
  const q = json?.quoteResponse?.result?.[0];
  if (!q) throw new Error("No BIST data");
  const current = q.regularMarketPrice ?? 0;
  const changerate = q.regularMarketChangePercent ?? 0;
  return {
    success: true,
    result: {
      current,
      currentstr: current.toLocaleString("tr-TR", { maximumFractionDigits: 2 }),
      changerate,
      changeratestr: Math.abs(changerate).toFixed(2),
      min: q.regularMarketDayLow ?? 0,
      minstr: (q.regularMarketDayLow ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 }),
      max: q.regularMarketDayHigh ?? 0,
      maxstr: (q.regularMarketDayHigh ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 }),
    },
  };
}

async function collectApiFetch(endpoint: string) {
  const res = await fetch(`${COLLECTAPI_BASE}${endpoint}`, {
    headers: {
      authorization: `apikey ${COLLECTAPI_KEY}`,
      "content-type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`CollectAPI error: ${res.status}`);
  return res.json();
}

// TCMB'den USD/TRY kuru çek (altın hesabı için)
async function getUsdTry(): Promise<number> {
  const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) throw new Error("TCMB error");
  const buf = await response.arrayBuffer();
  const xml = new TextDecoder("iso-8859-9").decode(buf);
  const m = xml.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
  if (!m) throw new Error("USD/TRY not found");
  return parseFloat(m[1]);
}

// Yahoo Finance + TCMB üzerinden ücretsiz altın fiyatı hesapla
async function getFallbackGoldData(): Promise<{ success: boolean; result: object[] }> {
  // XAU/USD spot fiyatı Yahoo Finance'den al
  const yahooRes = await fetch(
    "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d",
    { headers: { "User-Agent": "Mozilla/5.0" } }
  );
  if (!yahooRes.ok) throw new Error("Yahoo Finance error");
  const yahooData = await yahooRes.json();
  const xauUsd: number = yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (!xauUsd) throw new Error("No gold price from Yahoo");

  const usdTry = await getUsdTry();
  const gramUsd = xauUsd / 31.1035; // troy oz → gram
  const gramTry = gramUsd * usdTry;

  const spread = (price: number, pct: number) => (price * pct).toFixed(2);

  const result = [
    { name: "Gram Altın",        buy: spread(gramTry, 0.997),        sell: spread(gramTry, 1.003) },
    { name: "Çeyrek Altın",      buy: spread(gramTry * 1.75, 0.997), sell: spread(gramTry * 1.75, 1.003) },
    { name: "Yarım Altın",       buy: spread(gramTry * 3.5, 0.997),  sell: spread(gramTry * 3.5, 1.003) },
    { name: "Tam Altın",         buy: spread(gramTry * 7.0, 0.997),  sell: spread(gramTry * 7.0, 1.003) },
    { name: "Cumhuriyet Altını", buy: spread(gramTry * 7.2, 0.997),  sell: spread(gramTry * 7.2, 1.003) },
    { name: "Ons Altın",         buy: spread(xauUsd * usdTry, 0.997), sell: spread(xauUsd * usdTry, 1.003) },
  ];

  return { success: true, result };
}

// TCMB XML'ini parse ederek döviz listesi döndürür
function parseTcmbXml(xml: string) {
  const currencies: {
    code: string;
    name: string;
    unit: number;
    forexBuying: string;
    forexSelling: string;
    banknoteBuying: string;
    banknoteSelling: string;
  }[] = [];

  const currencyBlocks = xml.match(/<Currency[^>]*CurrencyCode="(\w+)"[^>]*>([\s\S]*?)<\/Currency>/g) || [];

  for (const block of currencyBlocks) {
    const codeMatch = block.match(/CurrencyCode="(\w+)"/);
    const unitMatch = block.match(/<Unit>(\d+)<\/Unit>/);
    const nameMatch = block.match(/<Isim>([^<]+)<\/Isim>/);
    const forexBuyingMatch = block.match(/<ForexBuying>([^<]+)<\/ForexBuying>/);
    const forexSellingMatch = block.match(/<ForexSelling>([^<]+)<\/ForexSelling>/);
    const banknoteBuyingMatch = block.match(/<BanknoteBuying>([^<]+)<\/BanknoteBuying>/);
    const banknoteSellingMatch = block.match(/<BanknoteSelling>([^<]+)<\/BanknoteSelling>/);

    if (!codeMatch || !forexBuyingMatch || !forexSellingMatch) continue;

    currencies.push({
      code: codeMatch[1],
      name: nameMatch ? nameMatch[1] : codeMatch[1],
      unit: unitMatch ? parseInt(unitMatch[1]) : 1,
      forexBuying: forexBuyingMatch[1],
      forexSelling: forexSellingMatch[1],
      banknoteBuying: banknoteBuyingMatch ? banknoteBuyingMatch[1] : "",
      banknoteSelling: banknoteSellingMatch ? banknoteSellingMatch[1] : "",
    });
  }

  return currencies;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // CollectAPI proxy endpoints
  app.get("/api/currency", async (_req, res) => {
    try {
      const data = await collectApiFetch("/allCurrency");
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  app.get("/api/gold", async (_req, res) => {
    // CollectAPI key varsa önce onu dene
    if (COLLECTAPI_KEY) {
      try {
        const data = await collectApiFetch("/goldPrice");
        return res.json(data);
      } catch {
        // key var ama çalışmıyorsa fallback'e düş
      }
    }
    // Ücretsiz fallback: Yahoo Finance XAU/USD + TCMB USD/TRY
    try {
      const data = await getFallbackGoldData();
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  app.get("/api/stocks", async (_req, res) => {
    if (COLLECTAPI_KEY) {
      try {
        const data = await collectApiFetch("/hisseSenedi");
        return res.json(data);
      } catch { /* fallback'e düş */ }
    }
    try {
      const data = await fetchStocksFromYahoo();
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  app.get("/api/bist", async (_req, res) => {
    if (COLLECTAPI_KEY) {
      try {
        const data = await collectApiFetch("/borsaIstanbul");
        return res.json(data);
      } catch { /* fallback'e düş */ }
    }
    try {
      const data = await fetchBistFromYahoo();
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // TCMB resmi döviz kurları (XML → JSON)
  app.get("/api/tcmb", async (_req, res) => {
    try {
      const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!response.ok) throw new Error(`TCMB error: ${response.status}`);
      const buf = await response.arrayBuffer();
      const xml = new TextDecoder("iso-8859-9").decode(buf);
      const currencies = parseTcmbXml(xml);
      res.json({ success: true, result: currencies });
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Binance 24h ticker verileri
  app.get("/api/binance", async (_req, res) => {
    try {
      const symbols = encodeURIComponent(
        '["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","XRPUSDT","ADAUSDT","DOGEUSDT","AVAXUSDT","DOTUSDT","LINKUSDT","LTCUSDT","UNIUSDT"]'
      );
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
      if (!response.ok) throw new Error(`Binance error: ${response.status}`);
      const data = await response.json();
      res.json({ success: true, result: data });
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
