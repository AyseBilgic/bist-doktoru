/**
 * BIST Doktoru - Collect API Route
 * Türk finans API'si üzerinden BIST hisse senetleri verilerini çeker
 * 
 * Collect API: https://api.collectapi.com/economy/
 * Dokümantasyon: https://collectapi.com/tr/api/economy/ekonomi-ve-finans-api
 * 
 * API Key: COLLECT_API_KEY environment variable'ından alınır
 * Ücretsiz plan: 100 istek/gün
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

interface BISTStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  marketCap?: number;
  sector?: string;
}

interface CollectAPIStockItem {
  text: string;
  lastprice: number;
  rate: number;
  hacim?: number;
  min?: number;
  max?: number;
  opening?: number;
  closing?: number;
}

// BIST sektör eşleştirmesi
const SECTOR_MAP: Record<string, string> = {
  THYAO: "Ulaşım", PGSUS: "Ulaşım", CCOLA: "Ulaşım",
  GARAN: "Bankacılık", AKBNK: "Bankacılık", ISCTR: "Bankacılık", YKBNK: "Bankacılık", HALKB: "Bankacılık", VAKBN: "Bankacılık",
  KCHOL: "Holding", SAHOL: "Holding", DOHOL: "Holding", TKFEN: "Holding",
  ASELS: "Savunma", ROKET: "Savunma", HATEK: "Savunma",
  EREGL: "Metal", KRDMD: "Metal",
  TUPRS: "Petrol", PETKM: "Kimya", AYGAZ: "Petrol",
  BIMAS: "Perakende", MGROS: "Perakende", SOKM: "Perakende",
  EKGYO: "GYO", ISGYO: "GYO",
  KOZAL: "Maden", KOZA: "Maden",
  SISE: "Cam", TRKCM: "Cam",
  FROTO: "Otomotiv", TOASO: "Otomotiv",
  ARCLK: "Beyaz Eşya", VESBE: "Beyaz Eşya",
};

/**
 * Collect API'den BIST hisse verilerini çeker
 */
async function fetchFromCollectAPI(apiKey: string): Promise<BISTStock[]> {
  const url = "https://api.collectapi.com/economy/hisseSenedi";
  
  const response = await fetch(url, {
    headers: {
      "Authorization": `apikey ${apiKey}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 }, // 5 dakika ISR
  });

  if (!response.ok) {
    throw new Error(`Collect API HTTP error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Collect API error: ${data.message || "API başarısız yanıt döndürdü"}`);
  }

  const stocks: BISTStock[] = (data.result || []).map((item: CollectAPIStockItem) => {
    const symbol = item.text?.toUpperCase() || "";
    const price = item.lastprice || 0;
    const changePercent = item.rate || 0;
    const change = price > 0 ? (price * changePercent) / (100 + changePercent) : 0;
    const prevClose = price - change;

    return {
      symbol,
      name: symbol, // Collect API isim döndürmüyor, sembol kullanıyoruz
      price,
      change,
      changePercent,
      volume: item.hacim || 0,
      high: item.max || price,
      low: item.min || price,
      open: item.opening || prevClose,
      prevClose,
      sector: SECTOR_MAP[symbol] || "Diğer",
    };
  });

  return stocks.filter((s) => s.symbol && s.price > 0);
}

/**
 * Alternatif: Borsa İstanbul'dan scraping (yedek yöntem)
 * Bu yöntem Collect API key yoksa kullanılır
 */
async function fetchFromBISTAlternative(): Promise<BISTStock[]> {
  // Yahoo Finance veya başka bir public kaynaktan BIST verileri
  // Bu örnek için statik veri döndürüyoruz
  throw new Error("Alternatif kaynak kullanılamıyor");
}

/**
 * Statik fallback veriler
 */
function getStaticFallback(): BISTStock[] {
  return [
    { symbol: "THYAO", name: "Türk Hava Yolları", price: 312.50, change: 6.60, changePercent: 2.15, volume: 42300000, high: 315.00, low: 308.50, open: 308.50, prevClose: 305.90, sector: "Ulaşım" },
    { symbol: "GARAN", name: "Garanti BBVA", price: 178.90, change: -1.50, changePercent: -0.83, volume: 38100000, high: 181.20, low: 177.80, open: 180.40, prevClose: 180.40, sector: "Bankacılık" },
    { symbol: "ASELS", name: "Aselsan", price: 89.45, change: 2.77, changePercent: 3.20, volume: 15700000, high: 90.10, low: 87.20, open: 87.20, prevClose: 86.68, sector: "Savunma" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", price: 56.70, change: -0.83, changePercent: -1.45, volume: 22400000, high: 57.90, low: 56.50, open: 57.53, prevClose: 57.53, sector: "Metal" },
    { symbol: "SISE", name: "Şişe Cam", price: 43.20, change: 0.20, changePercent: 0.47, volume: 18900000, high: 43.50, low: 42.80, open: 43.00, prevClose: 43.00, sector: "Cam" },
    { symbol: "KCHOL", name: "Koç Holding", price: 234.60, change: 4.36, changePercent: 1.89, volume: 12300000, high: 235.50, low: 231.80, open: 231.80, prevClose: 230.24, sector: "Holding" },
    { symbol: "AKBNK", name: "Akbank", price: 89.30, change: -0.20, changePercent: -0.22, volume: 29500000, high: 90.10, low: 89.00, open: 89.50, prevClose: 89.50, sector: "Bankacılık" },
    { symbol: "ISCTR", name: "İş Bankası C", price: 24.56, change: 0.27, changePercent: 1.12, volume: 55200000, high: 24.70, low: 24.30, open: 24.30, prevClose: 24.29, sector: "Bankacılık" },
    { symbol: "TUPRS", name: "Tüpraş", price: 198.30, change: -4.25, changePercent: -2.10, volume: 8400000, high: 203.50, low: 197.80, open: 202.55, prevClose: 202.55, sector: "Petrol" },
    { symbol: "BIMAS", name: "BİM Mağazalar", price: 567.00, change: 4.00, changePercent: 0.71, volume: 5100000, high: 568.50, low: 562.00, open: 563.00, prevClose: 563.00, sector: "Perakende" },
    { symbol: "SAHOL", name: "Sabancı Holding", price: 123.40, change: 1.89, changePercent: 1.55, volume: 14800000, high: 124.00, low: 121.80, open: 121.80, prevClose: 121.51, sector: "Holding" },
    { symbol: "PGSUS", name: "Pegasus", price: 1245.00, change: 41.50, changePercent: 3.45, volume: 2100000, high: 1248.00, low: 1205.00, open: 1205.00, prevClose: 1203.50, sector: "Ulaşım" },
    { symbol: "FROTO", name: "Ford Otosan", price: 1890.00, change: -18.10, changePercent: -0.95, volume: 1800000, high: 1910.00, low: 1885.00, open: 1908.10, prevClose: 1908.10, sector: "Otomotiv" },
    { symbol: "TOASO", name: "Tofaş", price: 345.00, change: 1.00, changePercent: 0.29, volume: 3200000, high: 346.50, low: 343.00, open: 344.00, prevClose: 344.00, sector: "Otomotiv" },
    { symbol: "EKGYO", name: "Emlak Konut GYO", price: 18.45, change: 0.42, changePercent: 2.33, volume: 78400000, high: 18.50, low: 18.10, open: 18.10, prevClose: 18.03, sector: "GYO" },
    { symbol: "KOZAL", name: "Koza Altın", price: 1234.00, change: 21.90, changePercent: 1.80, volume: 1200000, high: 1238.00, low: 1215.00, open: 1215.00, prevClose: 1212.10, sector: "Maden" },
    { symbol: "PETKM", name: "Petkim", price: 34.20, change: 0.30, changePercent: 0.88, volume: 25300000, high: 34.40, low: 33.90, open: 33.90, prevClose: 33.90, sector: "Kimya" },
    { symbol: "YKBNK", name: "Yapı Kredi", price: 45.80, change: 0.52, changePercent: 1.15, volume: 42100000, high: 46.00, low: 45.40, open: 45.40, prevClose: 45.28, sector: "Bankacılık" },
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const symbolParam = searchParams.get("symbol");

  // Cache kontrolü
  if (!symbolParam && !forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ...(cache.data as object),
      cached: true,
      cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
    });
  }

  const apiKey = process.env.COLLECT_API_KEY;
  let stocks: BISTStock[] = [];
  let source = "";
  let isFallback = false;

  if (apiKey) {
    try {
      stocks = await fetchFromCollectAPI(apiKey);
      source = "Collect API (collectapi.com)";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
      console.error("[Collect API Error]:", errorMessage);
      
      // Fallback'e geç
      stocks = getStaticFallback();
      source = "Statik Veri (Collect API Hatası)";
      isFallback = true;
    }
  } else {
    // API key yoksa statik veri kullan
    console.warn("[Collect API] API key bulunamadı (COLLECT_API_KEY). Statik veri kullanılıyor.");
    stocks = getStaticFallback();
    source = "Statik Veri (API Key Gerekli)";
    isFallback = true;
  }

  // Belirli sembol filtresi
  if (symbolParam) {
    stocks = stocks.filter((s) => s.symbol === symbolParam.toUpperCase());
  }

  const responseData = {
    stocks,
    count: stocks.length,
    source,
    timestamp: new Date().toISOString(),
    cached: false,
    fallback: isFallback,
    apiKeyConfigured: !!apiKey,
    ...(isFallback && {
      note: apiKey
        ? "Collect API'ye erişilemedi, statik veriler gösteriliyor"
        : "COLLECT_API_KEY environment variable ayarlanmamış. Gerçek veriler için .env.local dosyasına COLLECT_API_KEY ekleyin.",
    }),
  };

  // Cache'e kaydet
  if (!symbolParam) {
    cache = { data: responseData, timestamp: Date.now() };
  }

  return NextResponse.json(responseData);
}
