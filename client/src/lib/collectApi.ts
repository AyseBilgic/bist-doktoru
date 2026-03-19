// CollectAPI veri tipleri
export type CurrencyItem = {
  name: string;
  buying: string;
  selling: string;
  change?: string;
};

export type GoldItem = {
  name: string;
  buy: string;
  sell: string;
  change?: string;
};

export type StockItem = {
  code: string;
  text: string;
  lastprice: number;
  lastpricestr: string;
  rate: number;
  hacim: number;
  hacimstr: string;
};

export type BistIndex = {
  current: number;
  currentstr: string;
  changerate: number;
  changeratestr: string;
  min: number;
  minstr: string;
  max: number;
  maxstr: string;
};

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) return null;
    return json.result as T;
  } catch {
    return null;
  }
}

// Ücretsiz CDN fallback: fawazahmed0 currency-api XAU/TRY
// CollectAPI key yoksa veya sunucu erişimi yoksa devreye girer
async function fetchGoldFromCdn(): Promise<GoldItem[] | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json"
    );
    if (!res.ok) return null;
    const json = await res.json();
    const xauTry: number = json?.xau?.try;
    if (!xauTry) return null;

    // 1 troy ons = 31.1035 gram
    const gramTry = xauTry / 31.1035;
    const fmt = (n: number) => n.toFixed(2);
    const buy = (n: number) => fmt(n * 0.995);
    const sell = (n: number) => fmt(n * 1.005);

    return [
      { name: "Gram Altın",        buy: buy(gramTry),         sell: sell(gramTry) },
      { name: "Çeyrek Altın",      buy: buy(gramTry * 1.75),  sell: sell(gramTry * 1.75) },
      { name: "Yarım Altın",       buy: buy(gramTry * 3.5),   sell: sell(gramTry * 3.5) },
      { name: "Tam Altın",         buy: buy(gramTry * 7.0),   sell: sell(gramTry * 7.0) },
      { name: "Cumhuriyet Altını", buy: buy(gramTry * 7.2),   sell: sell(gramTry * 7.2) },
      { name: "Ons Altın (USD)",   buy: buy(xauTry),          sell: sell(xauTry) },
    ];
  } catch {
    return null;
  }
}

export const fetchCurrency = () => apiFetch<CurrencyItem[]>("/api/currency");

// Önce sunucu (CollectAPI), başarısız olursa ücretsiz CDN
export const fetchGold = async (): Promise<GoldItem[] | null> => {
  const fromServer = await apiFetch<GoldItem[]>("/api/gold");
  if (fromServer) return fromServer;
  return fetchGoldFromCdn();
};

export const fetchStocks = () => apiFetch<StockItem[]>("/api/stocks");
export const fetchBist = () => apiFetch<BistIndex>("/api/bist");
