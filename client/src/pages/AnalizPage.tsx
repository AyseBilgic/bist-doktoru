/**
 * BIST Doktoru - Piyasa Analizi Sayfası
 * CollectAPI döviz & altın tabloları + ekonomik takvim
 */
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { useCurrency, useGold } from "@/hooks/useMarketData";

function CurrencyTable() {
  const { data: currency, loading } = useCurrency();

  const wanted = ["USD", "EUR", "GBP", "CHF", "JPY", "SAR", "AUD", "CAD", "DKK", "SEK", "NOK"];
  const filtered = (currency ?? []).filter((c) =>
    wanted.some((code) => c.name.startsWith(code) || c.name.includes(code + " "))
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
        <DollarSign className="w-5 h-5" style={{ color: "oklch(0.65 0.20 220)" }} />
        Döviz Kurları
        <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: "oklch(0.70 0.18 160 / 0.12)", color: "oklch(0.70 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}>
          Canlı
        </span>
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.20 0.012 250)" }}>
        <div
          className="grid grid-cols-3 px-5 py-3 text-xs font-semibold"
          style={{ background: "oklch(0.13 0.015 250)", borderBottom: "1px solid oklch(0.20 0.012 250)", color: "oklch(0.55 0.010 250)" }}
        >
          <span>Para Birimi</span>
          <span className="text-right">Alış (₺)</span>
          <span className="text-right">Satış (₺)</span>
        </div>
        {loading && (
          <div className="px-5 py-6 text-center">
            <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Yükleniyor...</span>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="px-5 py-6 text-center">
            <span className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Veri alınamadı</span>
          </div>
        )}
        {filtered.map((item, i) => (
          <div
            key={item.name}
            className="grid grid-cols-3 px-5 py-3"
            style={{ borderBottom: i < filtered.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none", background: i % 2 === 0 ? "oklch(0.11 0.015 250)" : "oklch(0.105 0.015 250)" }}
          >
            <span className="text-sm" style={{ color: "oklch(0.85 0.005 250)" }}>{item.name}</span>
            <span className="text-right font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.80 0.005 250)" }}>{item.buying}</span>
            <span className="text-right font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>{item.selling}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoldTable() {
  const { data: gold, loading } = useGold();

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
        <BarChart2 className="w-5 h-5" style={{ color: "oklch(0.75 0.18 55)" }} />
        Altın Fiyatları
        <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: "oklch(0.70 0.18 160 / 0.12)", color: "oklch(0.70 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}>
          Canlı
        </span>
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.20 0.012 250)" }}>
        <div
          className="grid grid-cols-3 px-5 py-3 text-xs font-semibold"
          style={{ background: "oklch(0.13 0.015 250)", borderBottom: "1px solid oklch(0.20 0.012 250)", color: "oklch(0.55 0.010 250)" }}
        >
          <span>Tür</span>
          <span className="text-right">Alış (₺)</span>
          <span className="text-right">Satış (₺)</span>
        </div>
        {loading && (
          <div className="px-5 py-6 text-center">
            <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Yükleniyor...</span>
          </div>
        )}
        {!loading && (!gold || gold.length === 0) && (
          <div className="px-5 py-6 text-center">
            <span className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Veri alınamadı</span>
          </div>
        )}
        {(gold ?? []).map((item, i) => (
          <div
            key={item.name}
            className="grid grid-cols-3 px-5 py-3"
            style={{ borderBottom: i < (gold?.length ?? 0) - 1 ? "1px solid oklch(0.15 0.012 250)" : "none", background: i % 2 === 0 ? "oklch(0.11 0.015 250)" : "oklch(0.105 0.015 250)" }}
          >
            <span className="text-sm" style={{ color: "oklch(0.85 0.005 250)" }}>{item.name}</span>
            <span className="text-right font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.80 0.005 250)" }}>{item.buy}</span>
            <span className="text-right font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: item.sell === "-" ? "oklch(0.45 0.010 250)" : "oklch(0.90 0.005 250)" }}>{item.sell}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalizPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "oklch(0.18 0.012 250)", background: "oklch(0.10 0.015 250)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.70 0.18 160 / 0.15)" }}>
            <TrendingUp className="w-4 h-4" style={{ color: "oklch(0.70 0.18 160)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            Piyasa Analizi
          </h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "oklch(0.55 0.010 250)" }}>
          Canlı döviz/altın verileri (CollectAPI) ve ekonomik takvim
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Canlı Döviz & Altın Tabloları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyTable />
          <GoldTable />
        </div>

        {/* Ekonomik Takvim - tek TradingView widget */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            Ekonomik Takvim
          </h2>
          <div className="tv-widget-container" style={{ height: "450px" }}>
            <TradingViewWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
              config={{
                colorTheme: "dark",
                isTransparent: true,
                width: "100%",
                height: "100%",
                locale: "tr",
                importanceFilter: "-1,0,1",
                countryFilter: "tr,us,eu,gb,de,jp,cn",
              }}
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
