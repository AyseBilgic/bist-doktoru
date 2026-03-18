/**
 * BIST Doktoru - Kripto Para Sayfası
 * TradingView widget'ları ile canlı kripto veriler
 */
import { useState } from "react";
import { Bitcoin, ChevronUp, ChevronDown, Search } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

const CRYPTO_LIST = [
  { symbol: "BTCUSDT", name: "Bitcoin", ticker: "BINANCE:BTCUSDT", price: "$87,450", priceTRY: "₺3.421.500", change: "+2,87%", change24h: "+5,12%", volume: "$28,4B", mktCap: "$1,72T", up: true, color: "#F7931A" },
  { symbol: "ETHUSDT", name: "Ethereum", ticker: "BINANCE:ETHUSDT", price: "$3,245", priceTRY: "₺124.700", change: "+1,53%", change24h: "+3,21%", volume: "$14,2B", mktCap: "$389B", up: true, color: "#627EEA" },
  { symbol: "BNBUSDT", name: "BNB", ticker: "BINANCE:BNBUSDT", price: "$412", priceTRY: "₺15.820", change: "+0,89%", change24h: "+2,14%", volume: "$1,8B", mktCap: "$61B", up: true, color: "#F3BA2F" },
  { symbol: "SOLUSDT", name: "Solana", ticker: "BINANCE:SOLUSDT", price: "$178", priceTRY: "₺6.835", change: "-1,23%", change24h: "-2,45%", volume: "$3,1B", mktCap: "$82B", up: false, color: "#9945FF" },
  { symbol: "XRPUSDT", name: "XRP", ticker: "BINANCE:XRPUSDT", price: "$0,62", priceTRY: "₺23,80", change: "+3,45%", change24h: "+7,89%", volume: "$2,4B", mktCap: "$34B", up: true, color: "#346AA9" },
  { symbol: "ADAUSDT", name: "Cardano", ticker: "BINANCE:ADAUSDT", price: "$0,48", priceTRY: "₺18,43", change: "-0,67%", change24h: "-1,34%", volume: "$0,8B", mktCap: "$17B", up: false, color: "#0033AD" },
  { symbol: "DOGEUSDT", name: "Dogecoin", ticker: "BINANCE:DOGEUSDT", price: "$0,18", priceTRY: "₺6,91", change: "+4,56%", change24h: "+8,23%", volume: "$1,9B", mktCap: "$25B", up: true, color: "#C2A633" },
  { symbol: "AVAXUSDT", name: "Avalanche", ticker: "BINANCE:AVAXUSDT", price: "$38,50", priceTRY: "₺1.478", change: "-2,34%", change24h: "-4,12%", volume: "$0,6B", mktCap: "$16B", up: false, color: "#E84142" },
  { symbol: "DOTUSDT", name: "Polkadot", ticker: "BINANCE:DOTUSDT", price: "$7,82", priceTRY: "₺300", change: "+1,12%", change24h: "+2,34%", volume: "$0,4B", mktCap: "$11B", up: true, color: "#E6007A" },
  { symbol: "MATICUSDT", name: "Polygon", ticker: "BINANCE:MATICUSDT", price: "$0,89", priceTRY: "₺34,17", change: "-0,45%", change24h: "-0,89%", volume: "$0,5B", mktCap: "$8B", up: false, color: "#8247E5" },
  { symbol: "LINKUSDT", name: "Chainlink", ticker: "BINANCE:LINKUSDT", price: "$14,20", priceTRY: "₺545", change: "+2,78%", change24h: "+5,67%", volume: "$0,7B", mktCap: "$9B", up: true, color: "#2A5ADA" },
  { symbol: "LTCUSDT", name: "Litecoin", ticker: "BINANCE:LTCUSDT", price: "$89,40", priceTRY: "₺3.432", change: "+0,34%", change24h: "+0,78%", volume: "$0,5B", mktCap: "$7B", up: true, color: "#BFBBBB" },
];

const FEAR_GREED_VALUE = 72;

export default function KriptoPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BINANCE:BTCUSDT");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCryptos = CRYPTO_LIST.filter((c) =>
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fearGreedLabel = FEAR_GREED_VALUE >= 75 ? "Aşırı Açgözlülük" : FEAR_GREED_VALUE >= 55 ? "Açgözlülük" : FEAR_GREED_VALUE >= 45 ? "Nötr" : FEAR_GREED_VALUE >= 25 ? "Korku" : "Aşırı Korku";

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
        </div>
        <p className="text-sm ml-11" style={{ color: "oklch(0.55 0.010 250)" }}>
          Bitcoin, Ethereum ve yüzlerce kripto parayı canlı TRY ve USD paritelerinde takip edin
        </p>
      </div>

      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Bitcoin (BTC)", value: "$87,450", sub: "₺3.421.500", change: "+2,87%", up: true },
            { label: "Ethereum (ETH)", value: "$3,245", sub: "₺124.700", change: "+1,53%", up: true },
            { label: "Toplam Piyasa Değeri", value: "$2,89T", sub: "Kripto Piyasası", change: "+1,92%", up: true },
            { label: "Korku & Açgözlülük", value: fearGreedLabel, sub: `Endeks: ${FEAR_GREED_VALUE}/100`, change: "Açgözlülük", up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "oklch(0.12 0.015 250)", border: "1px solid oklch(0.20 0.012 250)" }}
            >
              <div className="text-xs mb-1" style={{ color: "oklch(0.55 0.010 250)", fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.label}
              </div>
              <div className="font-bold text-base" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.95 0.005 250)" }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.010 250)" }}>
                {stat.sub}
              </div>
              <div
                className="flex items-center gap-0.5 text-xs font-mono mt-1"
                style={{ color: stat.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {stat.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Crypto List */}
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
                className="grid grid-cols-3 px-4 py-2 text-xs font-medium"
                style={{ color: "oklch(0.50 0.010 250)", borderBottom: "1px solid oklch(0.17 0.012 250)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span>Kripto</span>
                <span className="text-right">USD</span>
                <span className="text-right">24s</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
                {filteredCryptos.map((crypto, i) => (
                  <div
                    key={crypto.symbol}
                    className="grid grid-cols-3 px-4 py-3 cursor-pointer transition-all duration-150"
                    style={{
                      borderBottom: i < filteredCryptos.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none",
                      background: selectedSymbol === crypto.symbol ? "oklch(0.75 0.18 55 / 0.06)" : "transparent",
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
                            color: selectedSymbol === crypto.symbol ? "oklch(0.75 0.18 55)" : "oklch(0.90 0.005 250)",
                          }}
                        >
                          {crypto.symbol.replace("USDT", "")}
                        </div>
                        <div className="text-xs" style={{ color: "oklch(0.45 0.010 250)" }}>
                          {crypto.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs flex items-center justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.88 0.005 250)" }}>
                      {crypto.price}
                    </div>
                    <div className="flex items-center justify-end">
                      <span
                        className="flex items-center gap-0.5 text-xs font-mono"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: crypto.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
                        }}
                      >
                        {crypto.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {crypto.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="xl:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                  {selectedSymbol.replace("USDT", "")} — Canlı Grafik
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

            {/* Technical Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.80 0.005 250)" }}>
                  Teknik Analiz
                </h3>
                <div className="tv-widget-container" style={{ height: "200px" }}>
                  <TradingViewWidget
                    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                    config={{
                      interval: "1D",
                      width: "100%",
                      isTransparent: true,
                      height: "100%",
                      symbol: selectedCrypto,
                      showIntervalTabs: true,
                      displayMode: "single",
                      locale: "tr",
                      colorTheme: "dark",
                    }}
                    height="100%"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.80 0.005 250)" }}>
                  Kripto Detayları
                </h3>
                <div className="tv-widget-container" style={{ height: "200px" }}>
                  <TradingViewWidget
                    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
                    config={{
                      symbol: selectedCrypto,
                      width: "100%",
                      locale: "tr",
                      colorTheme: "dark",
                      isTransparent: true,
                    }}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Screener */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
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
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            Kripto Para Detay Tablosu
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid oklch(0.20 0.012 250)" }}
          >
            <div
              className="grid grid-cols-6 px-5 py-3 text-xs font-semibold"
              style={{
                background: "oklch(0.13 0.015 250)",
                borderBottom: "1px solid oklch(0.20 0.012 250)",
                color: "oklch(0.55 0.010 250)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>Kripto / İsim</span>
              <span className="text-right">USD Fiyatı</span>
              <span className="text-right">TRY Fiyatı</span>
              <span className="text-right">24s Değişim</span>
              <span className="text-right">Hacim</span>
              <span className="text-right">Piyasa Değeri</span>
            </div>
            {CRYPTO_LIST.map((crypto, i) => (
              <div
                key={crypto.symbol}
                className="grid grid-cols-6 px-5 py-3 cursor-pointer transition-all duration-150 hover:bg-white/5"
                style={{
                  borderBottom: i < CRYPTO_LIST.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none",
                  background: i % 2 === 0 ? "oklch(0.11 0.015 250)" : "oklch(0.105 0.015 250)",
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
                    <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                      {crypto.symbol.replace("USDT", "")}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>
                      {crypto.name}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono text-sm flex items-center justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>
                  {crypto.price}
                </div>
                <div className="text-right font-mono text-sm flex items-center justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.75 0.010 250)" }}>
                  {crypto.priceTRY}
                </div>
                <div className="flex items-center justify-end">
                  <span
                    className="flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: crypto.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
                      background: crypto.up ? "oklch(0.70 0.18 160 / 0.1)" : "oklch(0.60 0.22 25 / 0.1)",
                    }}
                  >
                    {crypto.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {crypto.change24h}
                  </span>
                </div>
                <div className="text-right font-mono text-xs flex items-center justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.010 250)" }}>
                  {crypto.volume}
                </div>
                <div className="text-right font-mono text-xs flex items-center justify-end" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.010 250)" }}>
                  {crypto.mktCap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
