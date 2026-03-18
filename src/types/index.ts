// TCMB Döviz Kuru Tipleri
export interface TCMBRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  effectiveBuying: number;
  effectiveSelling: number;
  unit: number;
  date: string;
}

export interface TCMBResponse {
  rates: TCMBRate[];
  date: string;
  source: string;
  error?: string;
}

// Binance Kripto Tipleri
export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
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

export interface CryptoData {
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

export interface BinanceResponse {
  data: CryptoData[];
  usdtry: number;
  timestamp: string;
  source: string;
  error?: string;
}

// Collect API (BIST) Tipleri
export interface BISTStock {
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

export interface CollectAPIResponse {
  stocks: BISTStock[];
  timestamp: string;
  source: string;
  error?: string;
}

// Market Data (Combined)
export interface MarketDataResponse {
  tcmb: TCMBResponse;
  binance: BinanceResponse;
  bist: CollectAPIResponse;
  timestamp: string;
}

// Portfolio
export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  type: "hisse" | "kripto";
  quantity: number;
  avgCost: number;
  currentPrice: number;
}
