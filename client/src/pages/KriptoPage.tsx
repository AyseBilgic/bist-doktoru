/**
 * BIST Doktoru - Kripto Para Sayfası
 * Binance API canlı fiyatlar + TradingView ana grafik
 */
import { useState } from "react";
import { Bitcoin, Search, ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { useBinanceTickers } from "@/hooks/useMarketData";
import type { BinanceTicker } from "@/lib/binanceApi";

const CRYPTO_LIST = [
  { symbol: "BTCUSDT", name: "Bitcoin", ticker: "BINANCE:BTCUSDT", color: "#F7931A", short: "BTC" },
  { symbol: "ETHUSDT", name: "Ethereum", ticker: "BINANCE:ETHUSDT", color: "#627EEA", short: "ETH" },
  { symbol: "BNBUSDT", name: "BNB", ticker: "BINANCE:BNBUSDT", color: "#F3BA2F", short: "BNB" },
  { symbol: "SOLUSDT", name: "Solana", ticker: "BINANCE:SOLUSDT", color: "#9945FF", short: "SOL" },
  { symbol: "XRPUSDT", name: "XRP", ticker: "BINANCE:XRPUSDT", color: "#346AA9", short: "XRP" },
  { symbol: "ADAUSDT", name: "Cardano", ticker: "BINANCE:ADAUSDT", color: "#0033AD", short: "ADA" },
  { symbol: "DOGEUSDT", name: "Dogecoin", ticker: "BINANCE:DOGEUSDT", color: "#C2A633", short: "DOGE" },
  { symbol: "AVAXUSDT", name: "Avalanche", ticker: "BINANCE:AVAXUSDT", color: "#E84142", short: "AVAX" },
  { symbol: "DOTUSDT", name: "Polkadot", ticker: "BINANCE:DOTUSDT", color: "#E6007A", short: "DOT" },
  { symbol: "LINKUSDT", name: "Chainlink", ticker: "BINANCE:LINKUSDT", color: "#2A5ADA", short: "LINK" },
  { symbol: "LTCUSDT", name: "Litecoin", ticker: "BINANCE:LTCUSDT", color: "#BFBBBB", short: "LTC" },
  { symbol: "UNIUSDT", name: "Uniswap", ticker: "BINANCE:UNIUSDT", color: "#FF007A", short: "UNI" },
];

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 1000) return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(4);
  return num.toFixed(6);
}

function formatVolume(vol: string): string {
  const num = parseFloat(vol);
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  return `$${(num / 1_000).toFixed(2)}K`;
}

function ChangeCell({ pct }: { pct: string }) {
  const num = parseFloat(pct);
  const up = num >= 0;
  return (
    <span
      className="flex items-center gap-0.5 font-mono text-xs"
      style={{ color: up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      {up ? "+" : ""}{num.toFixed(2)}%
    </span>
  );
}

export default function KriptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BINANCE:BTCUSDT");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tickers, loading } = useBinanceTickers();

  const tickerMap = new Map<string, BinanceTicker>(
    (tickers || []).map((t) => [t.symbol, t])
  );

  const filteredCryptos = CRYPTO_LIST.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTicker = tickerMap.get(selectedSymbol);
  const selectedCrypto_ = CRYPTO_LIST.find((c) => c.symbol === selectedSymbol)!;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: "oklch(0.18 0.012 250)", background: "oklch(0.10 0.015 250)" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.75 0.18 55 / 0.15)" }}
          >
            <Bitcoin className="w-4 h-4" style={{ color: "oklch(0.75 0.18 55)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            Kripto Para Piyasası
          </h1>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "oklch(0.70 0.18 160 / 0.12)", color: "oklch(0.70 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Binance Canlı
          </span>
        </div>
        <p className="text-sm ml-11" style={{ color: "oklch(0.55 0.010 250)" }}>
          Bitcoin, Ethereum ve yüzlerce kripto parayı Binance canlı verileriyle takip edin
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Kripto Listesi — Binance canlı fiyatlar */}
          <div className="xl:col-span-1">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.50 0.010 250)" }} />
                <input
                  type="text"
                  placeholder="Kripto ara... (BTC, ETH...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: "oklch(0.14 0.015 250)",
                    border: "1px solid oklch(0.22 0.012 250)",
                    color: "oklch(0.90 0.005 250)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
              </div>
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid oklch(0.20 0.012 250)", background: "oklch(0.11 0.015 250)" }}
            >
              <div
                className="grid px-4 py-2 text-xs font-medium"
                style={{
                  gridTemplateColumns: "1fr auto auto",
                  color: "oklch(0.50 0.010 250)",
                  borderBottom: "1px solid oklch(0.17 0.012 250)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span>Kripto</span>
                <span className="text-right mr-3">Fiyat</span>
                <span className="text-right">24s</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "560px" }}>
                {loading && (
                  <div className="px-4 py-6 text-center">
                    <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Yükleniyor...</span>
                  </div>
                )}
                {filteredCryptos.map((crypto, i) => {
                  const ticker = tickerMap.get(crypto.symbol);
                  const pct = ticker ? parseFloat(ticker.priceChangePercent) : 0;
                  const up = pct >= 0;
                  const isSelected = selectedSymbol === crypto.symbol;

                  return (
                    <div
                      key={crypto.symbol}
                      className="grid items-center px-4 py-3 cursor-pointer transition-all duration-150"
                      style={{
                        gridTemplateColumns: "1fr auto auto",
                        borderBottom: i < filteredCryptos.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none",
                        background: isSelected ? "oklch(0.75 0.18 55 / 0.06)" : "transparent",
                      }}
                      onClick={() => {
                        setSelectedCrypto(crypto.ticker);
                        setSelectedSymbol(crypto.symbol);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0"
                          style={{ background: crypto.color + "33", border: `1px solid ${crypto.color}66` }}
                        />
                        <div>
                          <div
                            className="font-bold text-sm leading-tight"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: isSelected ? "oklch(0.75 0.18 55)" : "oklch(0.90 0.005 250)",
                            }}
                          >
                            {crypto.short}
                          </div>
                          <div className="text-xs leading-tight" style={{ color: "oklch(0.45 0.010 250)" }}>
                            {crypto.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right mr-3">
                        {ticker ? (
                          <span className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>
                            ${formatPrice(ticker.lastPrice)}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: "oklch(0.40 0.010 250)" }}>—</span>
                        )}
                      </div>

                      <div className="text-right">
                        {ticker ? (
                          <span
                            className="font-mono text-xs"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" }}
                          >
                            {up ? "+" : ""}{pct.toFixed(2)}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grafik + Stat Kartları */}
          <div className="xl:col-span-2 space-y-4">
            {/* Seçili kripto başlık + Binance stats */}
            {selectedTicker && (
              <div
                className="rounded-xl p-4"
                style={{ background: "oklch(0.11 0.015 250)", border: "1px solid oklch(0.20 0.012 250)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full"
                      style={{ background: selectedCrypto_.color + "33", border: `1px solid ${selectedCrypto_.color}66` }}
                    />
                    <div>
                      <div className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
                        {selectedCrypto_.name}
                      </div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>{selectedCrypto_.short}/USDT · Binance</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.95 0.005 250)" }}>
                      ${formatPrice(selectedTicker.lastPrice)}
                    </div>
                    <ChangeCell pct={selectedTicker.priceChangePercent} />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "24s Değişim", value: `$${formatPrice(selectedTicker.priceChange)}`, color: parseFloat(selectedTicker.priceChange) >= 0 ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" },
                    { label: "24s Yüksek", value: `$${formatPrice(selectedTicker.highPrice)}`, color: "oklch(0.90 0.005 250)" },
                    { label: "24s Düşük", value: `$${formatPrice(selectedTicker.lowPrice)}`, color: "oklch(0.90 0.005 250)" },
                    { label: "24s Hacim", value: formatVolume(selectedTicker.quoteVolume), color: "oklch(0.75 0.18 55)" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg p-3"
                      style={{ background: "oklch(0.09 0.015 250)", border: "1px solid oklch(0.17 0.012 250)" }}
                    >
                      <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.010 250)", fontFamily: "'Space Grotesk', sans-serif" }}>
                        {stat.label}
                      </div>
                      <div className="font-mono text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: stat.color }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TradingView Ana Grafik */}
            <div>
              <div className="tv-widget-container" style={{ height: "430px" }}>
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
                    backgroundColor: "rgba(10, 14, 26, 1)",
                    gridColor: "rgba(255, 255, 255, 0.04)",
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    calendar: false,
                    support_host: "https://www.tradingview.com",
                  }}
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tüm Kripto Tablosu — Binance canlı veriler */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
              Piyasa Özeti
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "oklch(0.70 0.18 160 / 0.12)", color: "oklch(0.70 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Binance · 30s güncelleme
            </span>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.20 0.012 250)" }}>
            {/* Tablo başlığı */}
            <div
              className="grid px-5 py-3 text-xs font-semibold"
              style={{
                gridTemplateColumns: "2fr 2fr 1.5fr 2fr 2fr 2fr",
                background: "oklch(0.13 0.015 250)",
                borderBottom: "1px solid oklch(0.20 0.012 250)",
                color: "oklch(0.55 0.010 250)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>Kripto Para</span>
              <span className="text-right">Fiyat (USD)</span>
              <span className="text-right">24s Değişim</span>
              <span className="text-right">24s Yüksek</span>
              <span className="text-right">24s Düşük</span>
              <span className="text-right">Hacim (USD)</span>
            </div>

            {loading && (
              <div className="px-5 py-8 text-center">
                <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Binance verileri yükleniyor...</span>
              </div>
            )}

            {!loading && (!tickers || tickers.length === 0) && (
              <div className="px-5 py-8 text-center">
                <span className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Veri alınamadı</span>
              </div>
            )}

            {CRYPTO_LIST.map((crypto, i) => {
              const ticker = tickerMap.get(crypto.symbol);
              if (!ticker && !loading) return null;
              const pct = ticker ? parseFloat(ticker.priceChangePercent) : 0;
              const up = pct >= 0;

              return (
                <div
                  key={crypto.symbol}
                  className="grid items-center px-5 py-3.5 cursor-pointer transition-all duration-150 hover:bg-white/[0.03]"
                  style={{
                    gridTemplateColumns: "2fr 2fr 1.5fr 2fr 2fr 2fr",
                    borderBottom: i < CRYPTO_LIST.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none",
                    background: selectedSymbol === crypto.symbol ? "oklch(0.75 0.18 55 / 0.04)" : "oklch(0.11 0.015 250)",
                  }}
                  onClick={() => {
                    setSelectedCrypto(crypto.ticker);
                    setSelectedSymbol(crypto.symbol);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {/* Kripto adı */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: crypto.color + "22", border: `1px solid ${crypto.color}55`, color: crypto.color }}
                    >
                      {crypto.short.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                        {crypto.short}
                      </div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>{crypto.name}</div>
                    </div>
                  </div>

                  {/* Fiyat */}
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.92 0.005 250)" }}>
                      {ticker ? `$${formatPrice(ticker.lastPrice)}` : "—"}
                    </span>
                  </div>

                  {/* 24s Değişim */}
                  <div className="text-right">
                    {ticker ? (
                      <span
                        className="inline-flex items-center gap-0.5 font-mono text-sm px-2 py-0.5 rounded"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
                          background: up ? "oklch(0.70 0.18 160 / 0.08)" : "oklch(0.60 0.22 25 / 0.08)",
                        }}
                      >
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {up ? "+" : ""}{pct.toFixed(2)}%
                      </span>
                    ) : "—"}
                  </div>

                  {/* 24s Yüksek */}
                  <div className="text-right">
                    <span className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.80 0.005 250)" }}>
                      {ticker ? `$${formatPrice(ticker.highPrice)}` : "—"}
                    </span>
                  </div>

                  {/* 24s Düşük */}
                  <div className="text-right">
                    <span className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.80 0.005 250)" }}>
                      {ticker ? `$${formatPrice(ticker.lowPrice)}` : "—"}
                    </span>
                  </div>

                  {/* Hacim */}
                  <div className="text-right">
                    <span className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.75 0.18 55)" }}>
                      {ticker ? formatVolume(ticker.quoteVolume) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
