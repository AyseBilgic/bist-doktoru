"use client";

/**
 * BIST Doktoru - Kripto Para Sayfası (Next.js)
 * Binance API + TradingView entegrasyonu
 */
import { useState, useEffect } from "react";
import { Bitcoin, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import type { CryptoData } from "@/types";

const STATIC_CRYPTO_LIST = [
  { symbol: "BTCUSDT", name: "Bitcoin", ticker: "BINANCE:BTCUSDT", color: "#F7931A", priceUSD: 88500, priceTRY: 3421500, change24h: 2.87, volume24h: 28500000000, high24h: 89200, low24h: 86800 },
  { symbol: "ETHUSDT", name: "Ethereum", ticker: "BINANCE:ETHUSDT", color: "#627EEA", priceUSD: 4740, priceTRY: 183400, change24h: 1.53, volume24h: 15200000000, high24h: 4820, low24h: 4680 },
  { symbol: "BNBUSDT", name: "BNB", ticker: "BINANCE:BNBUSDT", color: "#F3BA2F", priceUSD: 612, priceTRY: 23700, change24h: -0.45, volume24h: 1800000000, high24h: 625, low24h: 605 },
  { symbol: "SOLUSDT", name: "Solana", ticker: "BINANCE:SOLUSDT", color: "#9945FF", priceUSD: 178, priceTRY: 6890, change24h: 4.12, volume24h: 3200000000, high24h: 182, low24h: 171 },
  { symbol: "XRPUSDT", name: "XRP", ticker: "BINANCE:XRPUSDT", color: "#00AAE4", priceUSD: 2.45, priceTRY: 94.8, change24h: -1.23, volume24h: 5400000000, high24h: 2.52, low24h: 2.41 },
  { symbol: "ADAUSDT", name: "Cardano", ticker: "BINANCE:ADAUSDT", color: "#0033AD", priceUSD: 0.89, priceTRY: 34.5, change24h: 2.15, volume24h: 890000000, high24h: 0.92, low24h: 0.87 },
  { symbol: "DOGEUSDT", name: "Dogecoin", ticker: "BINANCE:DOGEUSDT", color: "#C2A633", priceUSD: 0.38, priceTRY: 14.7, change24h: -0.87, volume24h: 2100000000, high24h: 0.39, low24h: 0.37 },
  { symbol: "AVAXUSDT", name: "Avalanche", ticker: "BINANCE:AVAXUSDT", color: "#E84142", priceUSD: 38.5, priceTRY: 1490, change24h: 3.45, volume24h: 780000000, high24h: 39.2, low24h: 37.1 },
  { symbol: "DOTUSDT", name: "Polkadot", ticker: "BINANCE:DOTUSDT", color: "#E6007A", priceUSD: 8.9, priceTRY: 344, change24h: 1.78, volume24h: 450000000, high24h: 9.1, low24h: 8.7 },
  { symbol: "LINKUSDT", name: "Chainlink", ticker: "BINANCE:LINKUSDT", color: "#2A5ADA", priceUSD: 18.4, priceTRY: 712, change24h: -0.34, volume24h: 680000000, high24h: 18.9, low24h: 18.1 },
];

export default function KriptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BINANCE:BTCUSDT");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");
  const [usdtry, setUsdtry] = useState(38.65);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/binance");
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setCryptoData(data.data);
          if (data.usdtry) setUsdtry(data.usdtry);
          setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
        }
      }
    } catch (err) {
      console.error("Binance API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // 30 saniyede bir
    return () => clearInterval(interval);
  }, []);

  // Binance API verisi varsa onu kullan, yoksa statik
  const displayCryptos = cryptoData.length > 0
    ? cryptoData.map((c) => ({
        symbol: c.symbol,
        name: c.name,
        ticker: `BINANCE:${c.symbol}`,
        color: STATIC_CRYPTO_LIST.find((s) => s.symbol === c.symbol)?.color || "#888",
        priceUSD: c.priceUSD,
        priceTRY: c.priceTRY,
        change24h: c.change24h,
        volume24h: c.volume24h,
        high24h: c.high24h,
        low24h: c.low24h,
      }))
    : STATIC_CRYPTO_LIST;

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (price >= 1) return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return price.toLocaleString("en-US", { maximumFractionDigits: 4 });
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1_000_000_000) return `$${(vol / 1_000_000_000).toFixed(1)}B`;
    if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(0)}M`;
    return `$${(vol / 1_000).toFixed(0)}K`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Bitcoin className="w-5 h-5" style={{ color: "hsl(45, 100%, 50%)" }} />
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
            >
              Kripto Para Piyasası
            </h1>
            {cryptoData.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded ml-2"
                style={{
                  background: "hsl(45, 100%, 50%, 0.12)",
                  color: "hsl(45, 100%, 50%)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Binance API
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="text-xs px-3 py-1 rounded"
              style={{
                background: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(222, 30%, 18%)",
                color: "hsl(215, 20%, 60%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              USD/TRY: ₺{usdtry.toFixed(2)}
            </div>
            {lastUpdate && (
              <span
                className="text-xs"
                style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {lastUpdate}
              </span>
            )}
            <button
              onClick={fetchCryptoData}
              className="p-1.5 rounded hover:opacity-80 transition-opacity"
              style={{ color: "hsl(45, 100%, 50%)", background: "hsl(45, 100%, 50%, 0.1)" }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          Binance API ile gerçek zamanlı kripto para fiyatları — USD ve TRY paritelerinde
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Crypto List */}
        <div className="xl:col-span-1">
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid hsl(222, 30%, 18%)", background: "hsl(222, 47%, 8%)" }}
          >
            <div
              className="grid grid-cols-3 px-4 py-2 text-xs font-medium"
              style={{
                color: "hsl(215, 20%, 50%)",
                borderBottom: "1px solid hsl(222, 30%, 15%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>Kripto</span>
              <span className="text-right">USD</span>
              <span className="text-right">24s</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
              {displayCryptos.map((crypto, i) => (
                <div
                  key={crypto.symbol}
                  className="grid grid-cols-3 px-4 py-3 cursor-pointer transition-all duration-150 hover:bg-white/5"
                  style={{
                    borderBottom: i < displayCryptos.length - 1 ? "1px solid hsl(222, 30%, 13%)" : "none",
                    background: selectedSymbol === crypto.symbol ? "hsl(45, 100%, 50%, 0.06)" : "transparent",
                  }}
                  onClick={() => {
                    setSelectedCrypto(crypto.ticker);
                    setSelectedSymbol(crypto.symbol);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ background: crypto.color + "33", border: `1px solid ${crypto.color}55` }}
                    />
                    <div>
                      <div
                        className="font-bold text-xs"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: selectedSymbol === crypto.symbol ? "hsl(45, 100%, 50%)" : "hsl(210, 40%, 90%)",
                        }}
                      >
                        {crypto.symbol.replace("USDT", "")}
                      </div>
                      <div className="text-xs" style={{ color: "hsl(215, 20%, 45%)" }}>
                        {crypto.name}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-right font-mono text-xs flex items-center justify-end"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(210, 40%, 88%)" }}
                  >
                    ${formatPrice(crypto.priceUSD)}
                  </div>
                  <div className="flex items-center justify-end">
                    <span
                      className="flex items-center gap-0.5 text-xs font-mono"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: crypto.change24h >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                      }}
                    >
                      {crypto.change24h >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {Math.abs(crypto.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: TradingView Chart */}
        <div className="xl:col-span-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2
                className="font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}
              >
                {selectedSymbol.replace("USDT", "")} — Grafik
              </h2>
            </div>
            <div className="tv-widget-container" style={{ height: "500px" }}>
              <TradingViewWidget
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                config={{
                  autosize: true,
                  symbol: selectedCrypto,
                  interval: "D",
                  timezone: "Europe/Istanbul",
                  theme: "dark",
                  style: "1",
                  locale: "tr",
                  enable_publishing: false,
                  allow_symbol_change: true,
                  isTransparent: true,
                }}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kripto Screener */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          Kripto Para Tarayıcı
        </h2>
        <div className="tv-widget-container" style={{ height: "500px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              width: "100%",
              height: "100%",
              defaultColumn: "overview",
              defaultScreen: "general",
              market: "crypto",
              showToolbar: true,
              colorTheme: "dark",
              locale: "tr",
              isTransparent: true,
            }}
            height="100%"
          />
        </div>
      </div>

      {/* Detailed Crypto Table */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          Kripto Para Detay Tablosu
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid hsl(222, 30%, 18%)" }}
        >
          <div
            className="grid grid-cols-6 px-5 py-3 text-xs font-semibold"
            style={{
              background: "hsl(222, 47%, 9%)",
              borderBottom: "1px solid hsl(222, 30%, 18%)",
              color: "hsl(215, 20%, 55%)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span>Kripto / İsim</span>
            <span className="text-right">USD Fiyatı</span>
            <span className="text-right">TRY Fiyatı</span>
            <span className="text-right">24s Değişim</span>
            <span className="text-right">Hacim</span>
            <span className="text-right">24s Yüksek/Düşük</span>
          </div>
          {displayCryptos.map((crypto, i) => (
            <div
              key={crypto.symbol}
              className="grid grid-cols-6 px-5 py-3 cursor-pointer transition-all duration-150 hover:bg-white/5"
              style={{
                borderBottom: i < displayCryptos.length - 1 ? "1px solid hsl(222, 30%, 13%)" : "none",
                background: i % 2 === 0 ? "hsl(222, 47%, 7%)" : "hsl(222, 47%, 7.5%)",
              }}
              onClick={() => {
                setSelectedCrypto(crypto.ticker);
                setSelectedSymbol(crypto.symbol);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ background: crypto.color + "33", border: `1px solid ${crypto.color}55` }}
                />
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}
                  >
                    {crypto.symbol.replace("USDT", "")}
                  </div>
                  <div className="text-xs" style={{ color: "hsl(215, 20%, 50%)" }}>
                    {crypto.name}
                  </div>
                </div>
              </div>
              <div
                className="text-right font-mono text-sm flex items-center justify-end"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(210, 40%, 90%)" }}
              >
                ${formatPrice(crypto.priceUSD)}
              </div>
              <div
                className="text-right font-mono text-sm flex items-center justify-end"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 75%)" }}
              >
                ₺{formatPrice(crypto.priceTRY)}
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: crypto.change24h >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                    background: crypto.change24h >= 0 ? "hsl(142, 71%, 45%, 0.1)" : "hsl(0, 84%, 60%, 0.1)",
                  }}
                >
                  {crypto.change24h >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {Math.abs(crypto.change24h).toFixed(2)}%
                </span>
              </div>
              <div
                className="text-right font-mono text-xs flex items-center justify-end"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 65%)" }}
              >
                {formatVolume(crypto.volume24h)}
              </div>
              <div
                className="text-right font-mono text-xs flex items-center justify-end"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 65%)" }}
              >
                <span style={{ color: "hsl(142, 71%, 45%)" }}>${formatPrice(crypto.high24h)}</span>
                <span style={{ color: "hsl(215, 20%, 40%)" }}> / </span>
                <span style={{ color: "hsl(0, 84%, 60%)" }}>${formatPrice(crypto.low24h)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
