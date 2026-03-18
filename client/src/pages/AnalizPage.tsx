/**
 * BIST Doktoru - Piyasa Analizi Sayfası
 * TradingView widget'ları ile kapsamlı piyasa analizi
 */
import { TrendingUp, ChevronUp, ChevronDown, BarChart2, Globe } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SECTOR_DATA = [
  { name: "Bankacılık", change: "+1,45%", up: true, stocks: ["GARAN", "AKBNK", "ISCTR", "YKBNK"] },
  { name: "Holding", change: "+2,12%", up: true, stocks: ["KCHOL", "SAHOL", "DOHOL", "SNGYO"] },
  { name: "Savunma", change: "+3,67%", up: true, stocks: ["ASELS", "ROKET", "HATEK"] },
  { name: "Enerji", change: "-0,89%", up: false, stocks: ["TUPRS", "AYGAZ", "AKSEN"] },
  { name: "Otomotiv", change: "+1,23%", up: true, stocks: ["TOASO", "FROTO", "DOAS"] },
  { name: "Ulaşım", change: "+2,45%", up: true, stocks: ["THYAO", "PGSUS", "CLEBI"] },
  { name: "Metal", change: "-1,34%", up: false, stocks: ["EREGL", "KRDMD", "ALKIM"] },
  { name: "Perakende", change: "+0,78%", up: true, stocks: ["BIMAS", "MGROS", "SOKM"] },
];

const MARKET_NEWS = [
  {
    title: "BIST 100 Yeni Rekor Kırdı",
    summary: "Borsa İstanbul'da BIST 100 endeksi bugün 9.847 puanla tarihi zirvesini yeniledi. Yabancı yatırımcıların alım baskısı endeksi yukarı taşıdı.",
    time: "2 saat önce",
    tag: "BIST",
    up: true,
  },
  {
    title: "Fed Faiz Kararı Piyasaları Sarstı",
    summary: "ABD Merkez Bankası Fed'in faiz kararı açıklandı. Piyasalar beklentilerin altında kalan açıklamaya olumlu tepki verdi.",
    time: "4 saat önce",
    tag: "Küresel",
    up: true,
  },
  {
    title: "Bitcoin 90.000 Dolar Sınırını Test Ediyor",
    summary: "Kripto para piyasasının lideri Bitcoin, 90.000 dolar seviyesini test etmeye devam ediyor. Kurumsal alımlar artış gösteriyor.",
    time: "5 saat önce",
    tag: "Kripto",
    up: true,
  },
  {
    title: "Türk Lirası Dolar Karşısında Değer Kazandı",
    summary: "TCMB'nin faiz kararı sonrası Türk Lirası, dolar karşısında değer kazandı. USD/TRY paritesi 38,42 seviyesine geriledi.",
    time: "6 saat önce",
    tag: "Döviz",
    up: false,
  },
  {
    title: "Aselsan'dan Yeni Savunma Sanayi Anlaşması",
    summary: "Aselsan, yeni bir savunma sanayi ihracat anlaşması imzaladı. Hisse senedi yüzde 3,2 değer kazandı.",
    time: "8 saat önce",
    tag: "Hisse",
    up: true,
  },
  {
    title: "Altın Fiyatları Yükselişte",
    summary: "Küresel belirsizlik ortamında altın fiyatları yükselişini sürdürüyor. Gram altın 4.125 TL seviyesine ulaştı.",
    time: "10 saat önce",
    tag: "Emtia",
    up: true,
  },
];

const GLOBAL_MARKETS_CONFIG = {
  colorTheme: "dark",
  dateRange: "12M",
  showChart: true,
  locale: "tr",
  isTransparent: true,
  showSymbolLogo: true,
  showFloatingTooltip: false,
  width: "100%",
  height: "100%",
  tabs: [
    {
      title: "Endeksler",
      symbols: [
        { s: "BIST:XU100", d: "BIST 100" },
        { s: "SP:SPX", d: "S&P 500" },
        { s: "NASDAQ:NDX", d: "Nasdaq 100" },
        { s: "DJ:DJI", d: "Dow Jones" },
        { s: "XETR:DAX", d: "DAX" },
        { s: "LSE:UKX", d: "FTSE 100" },
      ],
      originalTitle: "Endeksler",
    },
    {
      title: "Emtia",
      symbols: [
        { s: "FOREXCOM:XAUUSD", d: "Altın" },
        { s: "FOREXCOM:XAGUSD", d: "Gümüş" },
        { s: "TVC:USOIL", d: "Brent Petrol" },
        { s: "TVC:NGAS", d: "Doğal Gaz" },
      ],
      originalTitle: "Emtia",
    },
    {
      title: "Döviz",
      symbols: [
        { s: "FX_IDC:USDTRY", d: "USD/TRY" },
        { s: "FX_IDC:EURTRY", d: "EUR/TRY" },
        { s: "FX:EURUSD", d: "EUR/USD" },
        { s: "FX:GBPUSD", d: "GBP/USD" },
        { s: "FX:USDJPY", d: "USD/JPY" },
      ],
      originalTitle: "Döviz",
    },
  ],
};

export default function AnalizPage() {
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
            style={{ background: "oklch(0.70 0.18 160 / 0.15)" }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: "oklch(0.70 0.18 160)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            Piyasa Analizi
          </h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "oklch(0.55 0.010 250)" }}>
          Sektör bazlı analizler, teknik göstergeler ve küresel piyasa verileri
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Global Markets Widget */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            <Globe className="w-5 h-5" style={{ color: "oklch(0.65 0.20 220)" }} />
            Küresel Piyasalar
          </h2>
          <div className="tv-widget-container" style={{ height: "420px" }}>
            <TradingViewWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
              config={GLOBAL_MARKETS_CONFIG}
              height="100%"
            />
          </div>
        </div>

        {/* Sector Analysis + News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Performance */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
              <BarChart2 className="w-5 h-5" style={{ color: "oklch(0.65 0.20 220)" }} />
              Sektör Performansı
            </h2>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid oklch(0.20 0.012 250)" }}
            >
              {SECTOR_DATA.map((sector, i) => (
                <div
                  key={sector.name}
                  className="px-5 py-4 transition-colors hover:bg-white/5"
                  style={{ borderBottom: i < SECTOR_DATA.length - 1 ? "1px solid oklch(0.15 0.012 250)" : "none", background: i % 2 === 0 ? "oklch(0.11 0.015 250)" : "oklch(0.105 0.015 250)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                      {sector.name}
                    </span>
                    <span
                      className="flex items-center gap-0.5 text-sm font-mono px-2 py-0.5 rounded"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: sector.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
                        background: sector.up ? "oklch(0.70 0.18 160 / 0.1)" : "oklch(0.60 0.22 25 / 0.1)",
                      }}
                    >
                      {sector.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {sector.change}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full mb-2" style={{ background: "oklch(0.18 0.012 250)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.abs(parseFloat(sector.change)) * 20}%`,
                        background: sector.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {sector.stocks.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "oklch(0.65 0.20 220 / 0.08)",
                          color: "oklch(0.65 0.20 220)",
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
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "oklch(0.65 0.20 220)" }} />
              Piyasa Haberleri
            </h2>
            <div className="space-y-3">
              {MARKET_NEWS.map((news, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: "oklch(0.12 0.015 250)", border: "1px solid oklch(0.20 0.012 250)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>
                      {news.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                      style={{
                        background: "oklch(0.65 0.20 220 / 0.12)",
                        color: "oklch(0.65 0.20 220)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {news.tag}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.58 0.010 250)" }}>
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "oklch(0.45 0.010 250)" }}>
                      {news.time}
                    </span>
                    <span
                      className="text-xs flex items-center gap-0.5"
                      style={{ color: news.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" }}
                    >
                      {news.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {news.up ? "Yükseliş" : "Düşüş"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Economic Calendar Widget */}
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

        {/* Heatmap Widget */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
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
    </div>
  );
}
