"use client";

/**
 * BIST Doktoru - BIST Hisse Senetleri Sayfası (Next.js)
 * Collect API + TradingView entegrasyonu
 */
import { useState, useEffect } from "react";
import { BarChart2, ChevronUp, ChevronDown, Search, RefreshCw } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import type { BISTStock } from "@/types";

// Statik BIST hisse listesi (Collect API'den gerçek veri gelene kadar)
const STATIC_BIST_STOCKS = [
  { symbol: "THYAO", name: "Türk Hava Yolları", sector: "Ulaşım", price: "312.50", change: "+2.15%", up: true, volume: "42.3M", mktCap: "₺418B" },
  { symbol: "GARAN", name: "Garanti BBVA", sector: "Bankacılık", price: "178.90", change: "-0.83%", up: false, volume: "38.1M", mktCap: "₺752B" },
  { symbol: "ASELS", name: "Aselsan", sector: "Savunma", price: "89.45", change: "+3.20%", up: true, volume: "15.7M", mktCap: "₺193B" },
  { symbol: "EREGL", name: "Ereğli Demir Çelik", sector: "Metal", price: "56.70", change: "-1.45%", up: false, volume: "22.4M", mktCap: "₺170B" },
  { symbol: "SISE", name: "Şişe Cam", sector: "Cam", price: "43.20", change: "+0.47%", up: true, volume: "18.9M", mktCap: "₺108B" },
  { symbol: "KCHOL", name: "Koç Holding", sector: "Holding", price: "234.60", change: "+1.89%", up: true, volume: "12.3M", mktCap: "₺703B" },
  { symbol: "AKBNK", name: "Akbank", sector: "Bankacılık", price: "89.30", change: "-0.22%", up: false, volume: "29.5M", mktCap: "₺357B" },
  { symbol: "ISCTR", name: "İş Bankası C", sector: "Bankacılık", price: "24.56", change: "+1.12%", up: true, volume: "55.2M", mktCap: "₺295B" },
  { symbol: "TUPRS", name: "Tüpraş", sector: "Petrol", price: "198.30", change: "-2.10%", up: false, volume: "8.4M", mktCap: "₺297B" },
  { symbol: "BIMAS", name: "BİM Mağazalar", sector: "Perakende", price: "567.00", change: "+0.71%", up: true, volume: "5.1M", mktCap: "₺397B" },
  { symbol: "SAHOL", name: "Sabancı Holding", sector: "Holding", price: "123.40", change: "+1.55%", up: true, volume: "14.8M", mktCap: "₺370B" },
  { symbol: "PGSUS", name: "Pegasus", sector: "Ulaşım", price: "1245.00", change: "+3.45%", up: true, volume: "2.1M", mktCap: "₺124B" },
  { symbol: "FROTO", name: "Ford Otosan", sector: "Otomotiv", price: "1890.00", change: "-0.95%", up: false, volume: "1.8M", mktCap: "₺756B" },
  { symbol: "TOASO", name: "Tofaş", sector: "Otomotiv", price: "345.00", change: "+0.29%", up: true, volume: "3.2M", mktCap: "₺172B" },
  { symbol: "EKGYO", name: "Emlak Konut GYO", sector: "GYO", price: "18.45", change: "+2.33%", up: true, volume: "78.4M", mktCap: "₺184B" },
  { symbol: "KOZAL", name: "Koza Altın", sector: "Maden", price: "1234.00", change: "+1.80%", up: true, volume: "1.2M", mktCap: "₺185B" },
  { symbol: "HEKTS", name: "Hektaş", sector: "Kimya", price: "45.60", change: "-0.65%", up: false, volume: "9.8M", mktCap: "₺18B" },
  { symbol: "PETKM", name: "Petkim", sector: "Kimya", price: "34.20", change: "+0.88%", up: true, volume: "25.3M", mktCap: "₺68B" },
];

const SECTORS = ["Tümü", "Bankacılık", "Holding", "Ulaşım", "Savunma", "Metal", "Petrol", "Otomotiv", "Perakende", "GYO", "Maden", "Kimya", "Cam"];

export default function BistPage() {
  const [selectedStock, setSelectedStock] = useState("BIST:THYAO");
  const [selectedSymbol, setSelectedSymbol] = useState("THYAO");
  const [selectedSector, setSelectedSector] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectStocks, setCollectStocks] = useState<BISTStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchBistData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/collect");
      if (res.ok) {
        const data = await res.json();
        if (data.stocks && data.stocks.length > 0) {
          setCollectStocks(data.stocks);
          setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
        }
      }
    } catch (err) {
      console.error("Collect API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBistData();
    const interval = setInterval(fetchBistData, 120000); // 2 dakikada bir
    return () => clearInterval(interval);
  }, []);

  // Collect API verisi varsa onu kullan, yoksa statik veri
  const displayStocks = collectStocks.length > 0
    ? collectStocks.map((s) => ({
        symbol: s.symbol,
        name: s.name,
        sector: s.sector || "—",
        price: s.price.toFixed(2),
        change: `${s.changePercent >= 0 ? "+" : ""}${s.changePercent.toFixed(2)}%`,
        up: s.changePercent >= 0,
        volume: s.volume >= 1_000_000 ? `${(s.volume / 1_000_000).toFixed(1)}M` : `${(s.volume / 1_000).toFixed(0)}K`,
        mktCap: s.marketCap ? `₺${(s.marketCap / 1_000_000_000).toFixed(0)}B` : "—",
      }))
    : STATIC_BIST_STOCKS;

  const filteredStocks = displayStocks.filter((s) => {
    const matchesSector = selectedSector === "Tümü" || s.sector === selectedSector;
    const matchesSearch =
      !searchQuery ||
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5" style={{ color: "hsl(217, 91%, 60%)" }} />
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
            >
              BIST Hisse Senetleri
            </h1>
            {collectStocks.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded ml-2"
                style={{
                  background: "hsl(142, 71%, 45%, 0.12)",
                  color: "hsl(142, 71%, 45%)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Collect API
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span
                className="text-xs"
                style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {lastUpdate}
              </span>
            )}
            <button
              onClick={fetchBistData}
              className="p-1.5 rounded hover:opacity-80 transition-opacity"
              style={{ color: "hsl(217, 91%, 60%)", background: "hsl(217, 91%, 60%, 0.1)" }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          Borsa İstanbul hisse senetleri — Collect API ile canlı veriler
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Stock List */}
        <div className="xl:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "hsl(215, 20%, 50%)" }}
            />
            <input
              type="text"
              placeholder="Hisse ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(222, 30%, 20%)",
                color: "hsl(210, 40%, 90%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
          </div>

          {/* Sector Filter */}
          <div className="flex gap-2 flex-wrap">
            {SECTORS.slice(0, 7).map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className="px-2.5 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background:
                    selectedSector === sector
                      ? "hsl(217, 91%, 60%, 0.2)"
                      : "hsl(222, 47%, 10%)",
                  border: `1px solid ${
                    selectedSector === sector
                      ? "hsl(217, 91%, 60%, 0.4)"
                      : "hsl(222, 30%, 20%)"
                  }`,
                  color:
                    selectedSector === sector
                      ? "hsl(217, 91%, 60%)"
                      : "hsl(215, 20%, 60%)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Stock List */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid hsl(222, 30%, 18%)",
              background: "hsl(222, 47%, 8%)",
            }}
          >
            <div
              className="grid grid-cols-3 px-4 py-2 text-xs font-medium"
              style={{
                color: "hsl(215, 20%, 50%)",
                borderBottom: "1px solid hsl(222, 30%, 15%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>Hisse</span>
              <span className="text-right">Fiyat</span>
              <span className="text-right">Değişim</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
              {filteredStocks.map((stock, i) => (
                <div
                  key={stock.symbol}
                  className="grid grid-cols-3 px-4 py-3 cursor-pointer transition-all duration-150 hover:bg-white/5"
                  style={{
                    borderBottom:
                      i < filteredStocks.length - 1
                        ? "1px solid hsl(222, 30%, 13%)"
                        : "none",
                    background:
                      selectedSymbol === stock.symbol
                        ? "hsl(217, 91%, 60%, 0.08)"
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelectedStock(`BIST:${stock.symbol}`);
                    setSelectedSymbol(stock.symbol);
                  }}
                >
                  <div>
                    <div
                      className="font-bold text-xs"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color:
                          selectedSymbol === stock.symbol
                            ? "hsl(217, 91%, 60%)"
                            : "hsl(210, 40%, 90%)",
                      }}
                    >
                      {stock.symbol}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "hsl(215, 20%, 45%)" }}
                    >
                      {stock.sector}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-mono text-xs"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "hsl(210, 40%, 88%)",
                      }}
                    >
                      ₺{stock.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="flex items-center justify-end gap-0.5 text-xs font-mono"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: stock.up
                          ? "hsl(142, 71%, 45%)"
                          : "hsl(0, 84%, 60%)",
                      }}
                    >
                      {stock.up ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      {stock.change}
                    </div>
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
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "hsl(210, 40%, 90%)",
                }}
              >
                {selectedSymbol} — Teknik Analiz Grafiği
              </h2>
            </div>
            <div className="tv-widget-container" style={{ height: "500px" }}>
              <TradingViewWidget
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                config={{
                  autosize: true,
                  symbol: selectedStock,
                  interval: "D",
                  timezone: "Europe/Istanbul",
                  theme: "dark",
                  style: "1",
                  locale: "tr",
                  enable_publishing: false,
                  allow_symbol_change: true,
                  calendar: false,
                  support_host: "https://www.tradingview.com",
                  isTransparent: true,
                }}
                height="100%"
              />
            </div>
          </div>

          {/* Technical Analysis */}
          <div>
            <h2
              className="font-bold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "hsl(210, 40%, 90%)",
              }}
            >
              Teknik Analiz Özeti
            </h2>
            <div className="tv-widget-container" style={{ height: "400px" }}>
              <TradingViewWidget
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                config={{
                  interval: "1D",
                  width: "100%",
                  isTransparent: true,
                  height: "100%",
                  symbol: selectedStock,
                  showIntervalTabs: true,
                  displayMode: "single",
                  locale: "tr",
                  colorTheme: "dark",
                }}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BIST Screener Widget */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(210, 40%, 95%)",
          }}
        >
          BIST Hisse Tarayıcı
        </h2>
        <div className="tv-widget-container" style={{ height: "500px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              width: "100%",
              height: "100%",
              defaultColumn: "overview",
              defaultScreen: "most_capitalized",
              market: "turkey",
              showToolbar: true,
              colorTheme: "dark",
              locale: "tr",
              isTransparent: true,
            }}
            height="100%"
          />
        </div>
      </div>

      {/* Detailed stock table */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(210, 40%, 95%)",
          }}
        >
          Hisse Senedi Detay Tablosu
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
            <span>Hisse / Şirket</span>
            <span>Sektör</span>
            <span className="text-right">Son Fiyat</span>
            <span className="text-right">Değişim</span>
            <span className="text-right">Hacim</span>
            <span className="text-right">Piyasa Değeri</span>
          </div>
          {displayStocks.map((stock, i) => (
            <div
              key={stock.symbol}
              className="grid grid-cols-6 px-5 py-3 cursor-pointer transition-all duration-150 hover:bg-white/5"
              style={{
                borderBottom:
                  i < displayStocks.length - 1
                    ? "1px solid hsl(222, 30%, 13%)"
                    : "none",
                background:
                  i % 2 === 0 ? "hsl(222, 47%, 7%)" : "hsl(222, 47%, 7.5%)",
              }}
              onClick={() => {
                setSelectedStock(`BIST:${stock.symbol}`);
                setSelectedSymbol(stock.symbol);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div>
                <div
                  className="font-bold text-xs"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "hsl(210, 40%, 90%)",
                  }}
                >
                  {stock.symbol}
                </div>
                <div className="text-xs" style={{ color: "hsl(215, 20%, 50%)" }}>
                  {stock.name}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className="text-xs"
                  style={{
                    color: "hsl(215, 20%, 60%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stock.sector}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="font-mono text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "hsl(210, 40%, 90%)",
                  }}
                >
                  ₺{stock.price}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="flex items-center gap-0.5 text-xs font-mono"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: stock.up ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                  }}
                >
                  {stock.up ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {stock.change}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="text-xs"
                  style={{
                    color: "hsl(215, 20%, 60%)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {stock.volume}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="text-xs"
                  style={{
                    color: "hsl(215, 20%, 60%)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {stock.mktCap}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
