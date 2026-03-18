/**
 * BIST Doktoru - Binance API Route
 * Binance Public API'den kripto para fiyatlarını çeker
 * 
 * Binance API Docs: https://binance-docs.github.io/apidocs/spot/en/
 * Rate Limit: 1200 requests/minute (IP bazlı)
 * API Key gerekmez (public endpoints)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30 * 1000; // 30 saniye (kripto için daha sık güncelleme)

// Takip edilecek kripto paralar
const TRACKED_SYMBOLS = [
  { symbol: "BTCUSDT", name: "Bitcoin", color: "#F7931A" },
  { symbol: "ETHUSDT", name: "Ethereum", color: "#627EEA" },
  { symbol: "BNBUSDT", name: "BNB", color: "#F3BA2F" },
  { symbol: "SOLUSDT", name: "Solana", color: "#9945FF" },
  { symbol: "XRPUSDT", name: "XRP", color: "#00AAE4" },
  { symbol: "ADAUSDT", name: "Cardano", color: "#0033AD" },
  { symbol: "DOGEUSDT", name: "Dogecoin", color: "#C2A633" },
  { symbol: "AVAXUSDT", name: "Avalanche", color: "#E84142" },
  { symbol: "DOTUSDT", name: "Polkadot", color: "#E6007A" },
  { symbol: "LINKUSDT", name: "Chainlink", color: "#2A5ADA" },
  { symbol: "MATICUSDT", name: "Polygon", color: "#8247E5" },
  { symbol: "UNIUSDT", name: "Uniswap", color: "#FF007A" },
  { symbol: "LTCUSDT", name: "Litecoin", color: "#BFBBBB" },
  { symbol: "ATOMUSDT", name: "Cosmos", color: "#2E3148" },
  { symbol: "NEARUSDT", name: "NEAR Protocol", color: "#00C08B" },
];

interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  count: number;
}

interface CryptoData {
  symbol: string;
  name: string;
  priceUSD: number;
  priceTRY: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  color: string;
}

/**
 * USD/TRY kurunu TCMB'den veya Binance'den al
 */
async function getUSDTRY(): Promise<number> {
  try {
    // Önce Binance'den dene (USDTTRY veya BUSDTRY)
    const binanceRes = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY",
      { next: { revalidate: 60 } }
    );
    if (binanceRes.ok) {
      const data = await binanceRes.json();
      if (data.price) return parseFloat(data.price);
    }
  } catch {
    // Binance'den alınamazsa devam et
  }

  try {
    // TCMB'den dene
    const tcmbRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tcmb`,
      { next: { revalidate: 900 } }
    );
    if (tcmbRes.ok) {
      const data = await tcmbRes.json();
      const usdRate = data.rates?.find((r: { code: string; selling: number }) => r.code === "USD");
      if (usdRate) return usdRate.selling;
    }
  } catch {
    // TCMB'den de alınamazsa fallback kullan
  }

  return 38.65; // Fallback USD/TRY
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const symbolParam = searchParams.get("symbol"); // Belirli bir sembol için

  // Cache kontrolü (tek sembol sorgusu için cache atla)
  if (!symbolParam && !forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ...(cache.data as object),
      cached: true,
      cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
    });
  }

  try {
    const symbolsToFetch = symbolParam
      ? [symbolParam.toUpperCase()]
      : TRACKED_SYMBOLS.map((s) => s.symbol);

    // Binance 24hr ticker endpoint - birden fazla sembol için
    let tickerData: BinanceTicker[] = [];

    if (symbolsToFetch.length === 1) {
      // Tek sembol
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbolsToFetch[0]}`,
        {
          headers: { "Accept": "application/json" },
          next: { revalidate: 30 },
        }
      );
      if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
      const single = await res.json();
      tickerData = [single];
    } else {
      // Çoklu sembol - symbols parametresi ile
      const symbolsJson = JSON.stringify(symbolsToFetch);
      const encodedSymbols = encodeURIComponent(symbolsJson);
      
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodedSymbols}`,
        {
          headers: { "Accept": "application/json" },
          next: { revalidate: 30 },
        }
      );
      if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
      tickerData = await res.json();
    }

    // USD/TRY kurunu al
    const usdtry = await getUSDTRY();

    // Veriyi işle
    const cryptoDataMap = new Map<string, CryptoData>();
    
    for (const ticker of tickerData) {
      const symbolInfo = TRACKED_SYMBOLS.find((s) => s.symbol === ticker.symbol);
      const priceUSD = parseFloat(ticker.lastPrice);
      
      cryptoDataMap.set(ticker.symbol, {
        symbol: ticker.symbol,
        name: symbolInfo?.name || ticker.symbol.replace("USDT", ""),
        priceUSD,
        priceTRY: priceUSD * usdtry,
        change24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.quoteVolume), // USD cinsinden hacim
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        color: symbolInfo?.color || "#888888",
      });
    }

    // Sıralı liste oluştur
    const data: CryptoData[] = symbolParam
      ? Array.from(cryptoDataMap.values())
      : TRACKED_SYMBOLS
          .map((s) => cryptoDataMap.get(s.symbol))
          .filter((d): d is CryptoData => d !== undefined);

    const responseData = {
      data,
      usdtry,
      count: data.length,
      source: "Binance Public API",
      timestamp: new Date().toISOString(),
      cached: false,
    };

    // Cache'e kaydet (tek sembol sorgusunu cache'leme)
    if (!symbolParam) {
      cache = { data: responseData, timestamp: Date.now() };
    }

    return NextResponse.json(responseData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("[Binance API Error]:", errorMessage);

    // Fallback veriler
    const usdtry = 38.65;
    const fallbackData: CryptoData[] = [
      { symbol: "BTCUSDT", name: "Bitcoin", priceUSD: 88500, priceTRY: 88500 * usdtry, change24h: 2.87, volume24h: 28500000000, high24h: 89200, low24h: 86800, color: "#F7931A" },
      { symbol: "ETHUSDT", name: "Ethereum", priceUSD: 4740, priceTRY: 4740 * usdtry, change24h: 1.53, volume24h: 15200000000, high24h: 4820, low24h: 4680, color: "#627EEA" },
      { symbol: "BNBUSDT", name: "BNB", priceUSD: 612, priceTRY: 612 * usdtry, change24h: -0.45, volume24h: 1800000000, high24h: 625, low24h: 605, color: "#F3BA2F" },
      { symbol: "SOLUSDT", name: "Solana", priceUSD: 178, priceTRY: 178 * usdtry, change24h: 4.12, volume24h: 3200000000, high24h: 182, low24h: 171, color: "#9945FF" },
      { symbol: "XRPUSDT", name: "XRP", priceUSD: 2.45, priceTRY: 2.45 * usdtry, change24h: -1.23, volume24h: 5400000000, high24h: 2.52, low24h: 2.41, color: "#00AAE4" },
      { symbol: "ADAUSDT", name: "Cardano", priceUSD: 0.89, priceTRY: 0.89 * usdtry, change24h: 2.15, volume24h: 890000000, high24h: 0.92, low24h: 0.87, color: "#0033AD" },
    ];

    return NextResponse.json({
      data: fallbackData,
      usdtry,
      count: fallbackData.length,
      source: "Binance API (Fallback - Tahmini Veriler)",
      timestamp: new Date().toISOString(),
      cached: false,
      error: errorMessage,
      fallback: true,
    }, {
      status: 200,
      headers: { "X-Fallback": "true" },
    });
  }
}
