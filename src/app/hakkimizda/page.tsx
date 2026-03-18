"use client";

/**
 * BIST Doktoru - Hakkımızda Sayfası (Next.js)
 */
import Link from "next/link";
import {
  Activity,
  Target,
  TrendingUp,
  Shield,
  Globe,
  BarChart2,
  Bitcoin,
  Briefcase,
  ArrowRight,
  Database,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart2,
    title: "BIST Hisse Senetleri",
    desc: "Borsa İstanbul'daki 500+ hisse senedini canlı TradingView grafikleriyle takip edin. Collect API ile gerçek zamanlı veriler.",
  },
  {
    icon: Bitcoin,
    title: "Kripto Para Piyasası",
    desc: "Bitcoin, Ethereum ve yüzlerce altcoin'i Binance API ile anlık fiyatlar ve grafiklerle takip edin. TRY ve USD paritelerinde.",
  },
  {
    icon: TrendingUp,
    title: "Piyasa Analizi",
    desc: "Sektör bazlı analizler, teknik göstergeler, ekonomik takvim ve küresel piyasa ısı haritası.",
  },
  {
    icon: Briefcase,
    title: "Portföy Takip",
    desc: "Hisse ve kripto portföyünüzü tek ekranda yönetin. Kâr/zarar hesaplama ve yatırım hesap makineleri.",
  },
  {
    icon: Globe,
    title: "Küresel Piyasalar",
    desc: "S&P 500, Nasdaq, DAX ve diğer küresel endeksleri takip edin. Döviz kurları ve emtia fiyatlarını anlık izleyin.",
  },
  {
    icon: Shield,
    title: "Güvenilir Veriler",
    desc: "TCMB resmi döviz verileri, Binance kripto API ve Collect API ile doğrulanmış piyasa bilgisi.",
  },
];

const API_INTEGRATIONS = [
  {
    name: "TCMB API",
    desc: "Türkiye Cumhuriyet Merkez Bankası resmi döviz kurları",
    endpoint: "/api/tcmb",
    color: "hsl(217, 91%, 60%)",
    icon: Database,
    features: ["USD/TRY, EUR/TRY ve 20+ döviz kuru", "Alış/satış ve efektif kurlar", "Günlük resmi TCMB verileri"],
  },
  {
    name: "Binance API",
    desc: "Dünyanın en büyük kripto borsasından gerçek zamanlı veriler",
    endpoint: "/api/binance",
    color: "hsl(45, 100%, 50%)",
    icon: Zap,
    features: ["BTC, ETH ve 100+ kripto para", "24s değişim, hacim, yüksek/düşük", "USD ve TRY paritelerinde fiyatlar"],
  },
  {
    name: "Collect API",
    desc: "BIST hisse senetleri için kapsamlı Türk finans API'si",
    endpoint: "/api/collect",
    color: "hsl(142, 71%, 45%)",
    icon: BarChart2,
    features: ["BIST hisse fiyatları ve değişimleri", "Hacim ve piyasa değeri verileri", "Sektör bazlı hisse bilgileri"],
  },
];

const ROADMAP = [
  {
    phase: "Faz 1",
    title: "Temel Platform",
    status: "tamamlandı",
    items: ["BIST hisse takibi", "Kripto para piyasası", "TCMB döviz entegrasyonu", "Binance API entegrasyonu", "Collect API entegrasyonu", "Portföy takip"],
  },
  {
    phase: "Faz 2",
    title: "Gelişmiş Özellikler",
    status: "geliştiriliyor",
    items: ["Fiyat alarmları", "Kullanıcı hesapları", "Portföy paylaşımı", "Mobil uygulama"],
  },
  {
    phase: "Faz 3",
    title: "Yapay Zeka Analizi",
    status: "planlı",
    items: ["AI destekli analiz", "Otomatik sinyal üretimi", "Kişiselleştirilmiş öneriler", "Risk değerlendirmesi"],
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: "hsl(222, 30%, 18%)", background: "hsl(222, 47%, 7%)" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(217, 91%, 60%, 0.15)" }}
          >
            <Activity className="w-4 h-4" style={{ color: "hsl(217, 91%, 60%)" }} />
          </div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            Hakkımızda
          </h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "hsl(215, 20%, 55%)" }}>
          BIST Doktoru&apos;nun vizyonu, API entegrasyonları ve yol haritası
        </p>
      </div>

      <div className="p-6 space-y-12 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "hsl(217, 91%, 60%, 0.15)",
                border: "1px solid hsl(217, 91%, 60%, 0.3)",
                color: "hsl(217, 91%, 60%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(217, 91%, 60%)" }} />
              Türkiye&apos;nin Borsa Platformu
            </div>
            <h2
              className="text-3xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 97%)" }}
            >
              BIST Doktoru
              <br />
              <span style={{ color: "hsl(217, 91%, 60%)" }}>Nedir?</span>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(215, 20%, 65%)" }}>
              BIST Doktoru, Türk yatırımcıların Borsa İstanbul hisse senetlerini, kripto paraları ve küresel piyasaları
              tek bir platformda takip edebilmesi için geliştirilmiş kapsamlı bir finans platformudur.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(215, 20%, 65%)" }}>
              TCMB resmi döviz API&apos;si, Binance kripto API&apos;si ve Collect API ile güçlendirilmiş platformumuz,
              canlı piyasa verilerini ve portföy yönetim özelliklerini bir araya getirmektedir.
            </p>
            <div className="flex gap-3">
              <Link href="/bist">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: "hsl(217, 91%, 60%)",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <BarChart2 className="w-4 h-4" />
                  BIST Hisseler
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link href="/kripto">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: "hsl(45, 100%, 50%, 0.2)",
                    border: "1px solid hsl(45, 100%, 50%, 0.4)",
                    color: "hsl(45, 100%, 50%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <Bitcoin className="w-4 h-4" />
                  Kripto
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Desteklenen Hisse", value: "500+", color: "hsl(217, 91%, 60%)" },
              { label: "Kripto Para", value: "100+", color: "hsl(45, 100%, 50%)" },
              { label: "Döviz Kuru", value: "20+", color: "hsl(142, 71%, 45%)" },
              { label: "API Kaynağı", value: "3", color: "hsl(189, 100%, 42%)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 text-center"
                style={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)" }}
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "hsl(215, 20%, 55%)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Integrations */}
        <div>
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            API Entegrasyonları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {API_INTEGRATIONS.map((api) => {
              const Icon = api.icon;
              return (
                <div
                  key={api.name}
                  className="rounded-xl p-5"
                  style={{ background: "hsl(222, 47%, 8%)", border: `1px solid ${api.color}30` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${api.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: api.color }} />
                    </div>
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: api.color, fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {api.name}
                      </div>
                      <div
                        className="text-xs font-mono"
                        style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {api.endpoint}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "hsl(215, 20%, 60%)" }}>
                    {api.desc}
                  </p>
                  <ul className="space-y-1.5">
                    {api.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "hsl(215, 20%, 65%)" }}>
                        <div className="w-1 h-1 rounded-full" style={{ background: api.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            Platform Özellikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl p-5"
                  style={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "hsl(217, 91%, 60%, 0.15)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "hsl(217, 91%, 60%)" }} />
                  </div>
                  <h3
                    className="font-semibold text-sm mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(215, 20%, 60%)" }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            <Target className="w-5 h-5 inline mr-2" style={{ color: "hsl(217, 91%, 60%)" }} />
            Yol Haritası
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-xl p-5"
                style={{
                  background: "hsl(222, 47%, 8%)",
                  border: `1px solid ${
                    phase.status === "tamamlandı"
                      ? "hsl(142, 71%, 45%, 0.3)"
                      : phase.status === "geliştiriliyor"
                      ? "hsl(217, 91%, 60%, 0.3)"
                      : "hsl(222, 30%, 20%)"
                  }`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {phase.phase}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background:
                        phase.status === "tamamlandı"
                          ? "hsl(142, 71%, 45%, 0.15)"
                          : phase.status === "geliştiriliyor"
                          ? "hsl(217, 91%, 60%, 0.15)"
                          : "hsl(222, 30%, 18%)",
                      color:
                        phase.status === "tamamlandı"
                          ? "hsl(142, 71%, 45%)"
                          : phase.status === "geliştiriliyor"
                          ? "hsl(217, 91%, 60%)"
                          : "hsl(215, 20%, 55%)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {phase.status}
                  </span>
                </div>
                <h3
                  className="font-bold mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}
                >
                  {phase.title}
                </h3>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "hsl(215, 20%, 65%)" }}
                    >
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          background:
                            phase.status === "tamamlandı"
                              ? "hsl(142, 71%, 45%)"
                              : phase.status === "geliştiriliyor"
                              ? "hsl(217, 91%, 60%)"
                              : "hsl(215, 20%, 40%)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
