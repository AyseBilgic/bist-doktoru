"use client";

/**
 * BIST Doktoru - Piyasa Analizi Sayfası (Next.js)
 */
import { TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

const MARKET_NEWS = [
  { title: "TCMB Faiz Kararı Beklentileri", summary: "Merkez Bankası'nın önümüzdeki toplantıda faiz oranını sabit tutması bekleniyor.", time: "2 saat önce", tag: "TCMB", up: true },
  { title: "BIST 100 Rekor Kırdı", summary: "Borsa İstanbul ana endeksi bugün tarihi zirveye ulaşarak 10.000 puanı aştı.", time: "4 saat önce", tag: "BIST", up: true },
  { title: "Bitcoin 90.000 Dolar Seviyesinde", summary: "BTC/USD paritesi kritik direnç seviyesini test ediyor, analistler yukarı kırılım bekliyor.", time: "5 saat önce", tag: "Kripto", up: true },
  { title: "Dolar/TL Kuru Hareketleri", summary: "Amerikan dolarının Türk lirası karşısındaki değeri küresel gelişmeler ışığında şekilleniyor.", time: "6 saat önce", tag: "Döviz", up: false },
  { title: "Petrol Fiyatları Geriledi", summary: "Brent ham petrol fiyatları OPEC+ kararları sonrası düşüş eğiliminde.", time: "8 saat önce", tag: "Emtia", up: false },
];

const SECTOR_PERFORMANCE = [
  { name: "Bankacılık", change: "+1.45%", up: true, stocks: ["GARAN", "AKBNK", "ISCTR", "YKBNK"] },
  { name: "Holding", change: "+2.10%", up: true, stocks: ["KCHOL", "SAHOL", "DOHOL", "TKFEN"] },
  { name: "Savunma", change: "+3.20%", up: true, stocks: ["ASELS", "ROKET", "HATEK"] },
  { name: "Ulaşım", change: "+1.89%", up: true, stocks: ["THYAO", "PGSUS", "CCOLA"] },
  { name: "Petrol & Kimya", change: "-0.75%", up: false, stocks: ["TUPRS", "PETKM", "AYGAZ"] },
  { name: "Metal & Çelik", change: "-1.20%", up: false, stocks: ["EREGL", "KRDMD", "ISGYO"] },
  { name: "Perakende", change: "+0.55%", up: true, stocks: ["BIMAS", "MGROS", "SOKM"] },
  { name: "GYO", change: "+2.33%", up: true, stocks: ["EKGYO", "TOASO", "ISGYO"] },
];

export default function AnalizPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5" style={{ color: "hsl(217, 91%, 60%)" }} />
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            Piyasa Analizi
          </h1>
        </div>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          Sektör analizleri, teknik göstergeler ve piyasa haberleri
        </p>
      </div>

      {/* Global Markets */}
      <div className="mb-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          Küresel Piyasalar
        </h2>
        <div className="tv-widget-container" style={{ height: "450px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={{
              colorTheme: "dark",
              dateRange: "1M",
              showChart: true,
              locale: "tr",
              isTransparent: true,
              showSymbolLogo: true,
              width: "100%",
              height: "100%",
              tabs: [
                {
                  title: "Endeksler",
                  symbols: [
                    { s: "BIST:XU100", d: "BIST 100" },
                    { s: "SP:SPX", d: "S&P 500" },
                    { s: "NASDAQ:NDX", d: "Nasdaq 100" },
                    { s: "FOREXCOM:DE40", d: "DAX 40" },
                    { s: "TVC:DXY", d: "Dolar Endeksi" },
                  ],
                },
                {
                  title: "Emtia",
                  symbols: [
                    { s: "TVC:GOLD", d: "Altın" },
                    { s: "TVC:SILVER", d: "Gümüş" },
                    { s: "TVC:USOIL", d: "Brent Petrol" },
                    { s: "TVC:NATURALGAS", d: "Doğal Gaz" },
                  ],
                },
                {
                  title: "Döviz",
                  symbols: [
                    { s: "FX_IDC:USDTRY", d: "USD/TRY" },
                    { s: "FX_IDC:EURTRY", d: "EUR/TRY" },
                    { s: "FX:EURUSD", d: "EUR/USD" },
                    { s: "FX:GBPUSD", d: "GBP/USD" },
                  ],
                },
              ],
            }}
            height="100%"
          />
        </div>
      </div>

      {/* Sector Performance + News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sector Performance */}
        <div>
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(217, 91%, 60%)" }} />
            Sektör Performansı
          </h2>
          <div className="space-y-2">
            {SECTOR_PERFORMANCE.map((sector) => (
              <div
                key={sector.name}
                className="rounded-xl p-4"
                style={{
                  background: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-semibold text-sm"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "hsl(210, 40%, 90%)",
                    }}
                  >
                    {sector.name}
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-sm font-mono px-2 py-0.5 rounded"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: sector.up ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                      background: sector.up
                        ? "hsl(142, 71%, 45%, 0.1)"
                        : "hsl(0, 84%, 60%, 0.1)",
                    }}
                  >
                    {sector.up ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {sector.change}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {sector.stocks.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "hsl(217, 91%, 60%, 0.08)",
                        color: "hsl(217, 91%, 60%)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div>
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(217, 91%, 60%)" }} />
            Piyasa Haberleri
          </h2>
          <div className="space-y-3">
            {MARKET_NEWS.map((news, i) => (
              <div
                key={i}
                className="rounded-xl p-4 transition-all hover:scale-[1.01]"
                style={{
                  background: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className="font-semibold text-sm leading-tight"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "hsl(210, 40%, 90%)",
                    }}
                  >
                    {news.title}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: "hsl(217, 91%, 60%, 0.12)",
                      color: "hsl(217, 91%, 60%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {news.tag}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed mb-2"
                  style={{ color: "hsl(215, 20%, 58%)" }}
                >
                  {news.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "hsl(215, 20%, 45%)" }}
                  >
                    {news.time}
                  </span>
                  <span
                    className="text-xs flex items-center gap-0.5"
                    style={{
                      color: news.up ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                    }}
                  >
                    {news.up ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {news.up ? "Yükseliş" : "Düşüş"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Economic Calendar */}
      <div className="mb-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
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

      {/* Heatmap */}
      <div>
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          Piyasa Isı Haritası
        </h2>
        <div className="tv-widget-container" style={{ height: "500px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
            config={{
              exchanges: [],
              dataSource: "BIST",
              grouping: "sector",
              blockSize: "market_cap_basic",
              blockColor: "change",
              locale: "tr",
              symbolUrl: "",
              colorTheme: "dark",
              hasTopBar: true,
              isDataSetEnabled: false,
              isZoomEnabled: true,
              hasSymbolTooltip: true,
              isMonoSize: false,
              width: "100%",
              height: "100%",
            }}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
