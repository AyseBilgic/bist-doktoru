/**
 * BIST Doktoru - BIST Hisse Senetleri Sayfası
 * CollectAPI canlı hisse listesi + TradingView ana grafik (tek widget)
 */
import { useState, useMemo } from "react";
import { BarChart2, ChevronUp, ChevronDown, Search } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { useStocks, useBist } from "@/hooks/useMarketData";

const SECTOR_KEYWORDS: Record<string, string> = {
  BANKA: "Bankacılık", FINANS: "Bankacılık",
  HAVA: "Ulaşım", PEGASUS: "Ulaşım",
  DEMIR: "Metal", CELIK: "Metal", ALUM: "Metal",
  HOLDING: "Holding",
  ENERJI: "Enerji", PETROL: "Enerji",
  OTOMOT: "Otomotiv", TOFAS: "Otomotiv",
  TELEKOM: "Telekomünikasyon", TURKCELL: "Telekomünikasyon",
  SAVUNMA: "Savunma", ASELSAN: "Savunma",
  PERAKENDE: "Perakende", MIGROS: "Perakende",
};

function getSector(text: string): string {
  const u = text.toUpperCase();
  for (const [kw, sector] of Object.entries(SECTOR_KEYWORDS)) {
    if (u.includes(kw)) return sector;
  }
  return "Diğer";
}

const SECTORS = ["Tümü", "Bankacılık", "Holding", "Ulaşım", "Savunma", "Metal", "Enerji", "Otomotiv", "Perakende", "Telekomünikasyon", "Diğer"];

export default function BistPage() {
  const [selectedStock, setSelectedStock] = useState("BIST:THYAO");
  const [selectedSymbol, setSelectedSymbol] = useState("THYAO");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("Tümü");

  const { data: stocks, loading } = useStocks();
  const { data: bist } = useBist();

  const enriched = useMemo(() =>
    (stocks ?? []).map((s) => ({ ...s, sector: getSector(s.text) })),
    [stocks]
  );

  const filtered = useMemo(() =>
    enriched.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (s.code.toLowerCase().includes(q) || s.text.toLowerCase().includes(q))
        && (selectedSector === "Tümü" || s.sector === selectedSector);
    }),
    [enriched, searchQuery, selectedSector]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "oklch(0.18 0.012 250)", background: "oklch(0.10 0.015 250)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.65 0.20 220 / 0.15)" }}>
            <BarChart2 className="w-4 h-4" style={{ color: "oklch(0.65 0.20 220)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            BIST Hisse Senetleri
          </h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "oklch(0.55 0.010 250)" }}>
          Borsa İstanbul'daki tüm hisse senetleri canlı CollectAPI verisiyle
        </p>
      </div>

      <div className="p-6">
        {/* BIST 100 Endeks Bandı */}
        {bist && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-6 flex-wrap"
            style={{ background: "oklch(0.12 0.015 250)", border: "1px solid oklch(0.20 0.012 250)" }}
          >
            <div>
              <div className="text-xs mb-0.5" style={{ color: "oklch(0.55 0.010 250)", fontFamily: "'Space Grotesk', sans-serif" }}>BIST 100 Endeksi</div>
              <div className="font-mono text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.95 0.005 250)" }}>{bist.currentstr}</div>
            </div>
            <div
              className="flex items-center gap-1 text-lg font-mono font-bold"
              style={{ color: bist.changerate >= 0 ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" }}
            >
              {bist.changerate >= 0 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              {bist.changerate >= 0 ? "+" : ""}{bist.changeratestr}%
            </div>
            <div className="flex gap-4 text-xs ml-auto" style={{ color: "oklch(0.55 0.010 250)", fontFamily: "'JetBrains Mono', monospace" }}>
              <span>Min: {bist.minstr}</span>
              <span>Max: {bist.maxstr}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Hisse Listesi */}
          <div className="xl:col-span-1">
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.50 0.010 250)" }} />
                <input
                  type="text"
                  placeholder="Hisse ara... (THYAO, GARAN...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.14 0.015 250)", border: "1px solid oklch(0.22 0.012 250)", color: "oklch(0.90 0.005 250)" }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {SECTORS.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSector(s)}
                    className="px-2.5 py-1 rounded text-xs font-medium transition-all"
                    style={{
                      background: selectedSector === s ? "oklch(0.65 0.20 220 / 0.2)" : "oklch(0.14 0.015 250)",
                      border: `1px solid ${selectedSector === s ? "oklch(0.65 0.20 220 / 0.4)" : "oklch(0.22 0.012 250)"}`,
                      color: selectedSector === s ? "oklch(0.65 0.20 220)" : "oklch(0.60 0.010 250)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.20 0.012 250)", background: "oklch(0.11 0.015 250)" }}>
              <div className="grid grid-cols-3 px-4 py-2 text-xs font-medium" style={{ color: "oklch(0.50 0.010 250)", borderBottom: "1px solid oklch(0.17 0.012 250)" }}>
                <span>Hisse</span>
                <span className="text-right">Fiyat</span>
                <span className="text-right">Değişim</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
                {loading && (
                  <div className="px-4 py-6 text-center">
                    <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Yükleniyor...</span>
                  </div>
                )}
                {!loading && filtered.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <span className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Sonuç bulunamadı</span>
                  </div>
                )}
                {filtered.map((stock, i) => {
                  const up = stock.rate >= 0;
                  return (
                    <div
                      key={stock.code}
                      className="grid grid-cols-3 px-4 py-3 cursor-pointer transition-all"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none",
                        background: selectedSymbol === stock.code ? "oklch(0.65 0.20 220 / 0.08)" : "transparent",
                      }}
                      onClick={() => { setSelectedStock(`BIST:${stock.code}`); setSelectedSymbol(stock.code); }}
                    >
                      <div>
                        <div className="font-bold text-xs" style={{ color: selectedSymbol === stock.code ? "oklch(0.65 0.20 220)" : "oklch(0.90 0.005 250)" }}>{stock.code}</div>
                        <div className="text-xs" style={{ color: "oklch(0.45 0.010 250)" }}>{stock.sector}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.88 0.005 250)" }}>₺{stock.lastpricestr}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-0.5 text-xs font-mono" style={{ color: up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" }}>
                          {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {up ? "+" : ""}{stock.rate.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ana Grafik - tek TradingView widget */}
          <div className="xl:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                {selectedSymbol} — Teknik Analiz
              </span>
            </div>
            <div className="tv-widget-container" style={{ height: "560px" }}>
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
                  backgroundColor: "rgba(10, 14, 26, 1)",
                  gridColor: "rgba(255, 255, 255, 0.04)",
                  hide_top_toolbar: false,
                  hide_legend: false,
                  save_image: false,
                  support_host: "https://www.tradingview.com",
                }}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
