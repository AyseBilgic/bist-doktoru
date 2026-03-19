/**
 * BIST Doktoru - Ana Sayfa (Dashboard)
 * Canlı piyasa verileri: CollectAPI
 */
import { Link } from "wouter";
import {
  BarChart2, Bitcoin, TrendingUp, Briefcase,
  ArrowRight, ChevronUp, ChevronDown, Activity, Globe, Shield,
} from "lucide-react";
import { useBist, useCurrency, useGold, useStocks } from "@/hooks/useMarketData";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663451065819/YKtmvmmBUBqBDrsdHYiG7Z/bist-hero-bg-LsVfhNx7F8B9CqqXsiAa2d.webp";

const FEATURES = [
  { icon: BarChart2, title: "BIST Hisse Senetleri", desc: "Borsa İstanbul'daki tüm hisse senetlerini canlı verilerle takip edin.", href: "/bist", color: "oklch(0.65 0.20 220)" },
  { icon: Bitcoin, title: "Kripto Para", desc: "Bitcoin, Ethereum ve yüzlerce kripto parayı TRY/USD paritelerinde izleyin.", href: "/kripto", color: "oklch(0.75 0.18 55)" },
  { icon: TrendingUp, title: "Piyasa Analizi", desc: "Canlı döviz/altın tabloları ve ekonomik takvim ile bilinçli kararlar alın.", href: "/analiz", color: "oklch(0.70 0.18 160)" },
  { icon: Briefcase, title: "Portföy Takip", desc: "Hisse ve kripto portföyünüzü tek ekranda yönetin, kâr/zarar hesaplayın.", href: "/portfoy", color: "oklch(0.65 0.18 280)" },
];

// Hero altı canlı stats bar
function MarketStatsBar() {
  const { data: bist } = useBist();
  const { data: currency } = useCurrency();
  const { data: gold } = useGold();

  const stats: { label: string; value: string; change?: string; up?: boolean }[] = [];

  if (bist) {
    stats.push({ label: "BIST 100", value: bist.currentstr, change: `${bist.changerate >= 0 ? "+" : ""}${bist.changeratestr}%`, up: bist.changerate >= 0 });
  }
  if (currency) {
    const usd = currency.find((c) => c.name.includes("USD"));
    const eur = currency.find((c) => c.name.includes("EUR") && !c.name.includes("USD"));
    if (usd) stats.push({ label: "USD/TRY", value: `₺${usd.selling}` });
    if (eur) stats.push({ label: "EUR/TRY", value: `₺${eur.selling}` });
  }
  if (gold) {
    const gram = gold.find((g) => g.name.includes("Gram"));
    if (gram) stats.push({ label: "GRAM ALTIN", value: `₺${gram.buy}` });
  }

  if (stats.length === 0) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 py-3 px-6 overflow-x-auto"
      style={{ background: "oklch(0.06 0.015 250 / 0.9)", borderTop: "1px solid oklch(0.20 0.012 250)" }}
    >
      <div className="flex items-center gap-6 min-w-max">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "oklch(0.55 0.010 250)", fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</span>
            <span className="font-mono text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>{s.value}</span>
            {s.change && (
              <span className="flex items-center gap-0.5 text-xs font-mono" style={{ color: s.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)" }}>
                {s.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {s.change}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// En yüksek hacimli hisseler
function TopStocks() {
  const { data: stocks, loading } = useStocks();
  const top = stocks ? [...stocks].sort((a, b) => b.hacim - a.hacim).slice(0, 10) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
          En Yüksek Hacimli
        </h2>
        <Link href="/bist">
          <span className="text-xs flex items-center gap-1 hover:underline" style={{ color: "oklch(0.65 0.20 220)" }}>
            Tümü <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.20 0.012 250)", background: "oklch(0.11 0.015 250)" }}>
        {loading && (
          <div className="px-4 py-8 text-center">
            <span className="text-xs animate-pulse" style={{ color: "oklch(0.50 0.010 250)" }}>Yükleniyor...</span>
          </div>
        )}
        {!loading && top.length === 0 && (
          <div className="px-4 py-8 text-center">
            <span className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Veri alınamadı</span>
          </div>
        )}
        {top.map((stock, i) => {
          const up = stock.rate >= 0;
          return (
            <div
              key={stock.code}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              style={{ borderBottom: i < top.length - 1 ? "1px solid oklch(0.17 0.012 250)" : "none" }}
            >
              <div>
                <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>{stock.code}</div>
                <div className="text-xs" style={{ color: "oklch(0.50 0.010 250)" }}>Hacim: {stock.hacimstr}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>₺{stock.lastpricestr}</div>
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
  );
}

// Döviz + altın özet kartları
function MarketCards() {
  const { data: currency } = useCurrency();
  const { data: gold } = useGold();

  const cards: { label: string; value: string; sub: string; color: string }[] = [];

  if (currency) {
    const usd = currency.find((c) => c.name.includes("USD"));
    const eur = currency.find((c) => c.name.includes("EUR") && !c.name.includes("USD"));
    const gbp = currency.find((c) => c.name.includes("GBP"));
    if (usd) cards.push({ label: "USD/TRY", value: `₺${usd.selling}`, sub: `Alış: ₺${usd.buying}`, color: "oklch(0.65 0.20 220)" });
    if (eur) cards.push({ label: "EUR/TRY", value: `₺${eur.selling}`, sub: `Alış: ₺${eur.buying}`, color: "oklch(0.70 0.18 140)" });
    if (gbp) cards.push({ label: "GBP/TRY", value: `₺${gbp.selling}`, sub: `Alış: ₺${gbp.buying}`, color: "oklch(0.68 0.16 60)" });
  }
  if (gold) {
    const gram = gold.find((g) => g.name.includes("Gram"));
    const ceyrek = gold.find((g) => g.name.includes("Çeyrek"));
    if (gram) cards.push({ label: "Gram Altın", value: `₺${gram.buy}`, sub: `Satış: ₺${gram.sell}`, color: "oklch(0.75 0.18 55)" });
    if (ceyrek) cards.push({ label: "Çeyrek Altın", value: `₺${ceyrek.buy}`, sub: `Satış: ₺${ceyrek.sell}`, color: "oklch(0.72 0.16 45)" });
  }

  if (cards.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
        Döviz & Altın
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{ background: "oklch(0.12 0.015 250)", border: "1px solid oklch(0.20 0.012 250)" }}
          >
            <div className="text-xs mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: card.color }}>{card.label}</div>
            <div className="font-mono font-bold text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.92 0.005 250)" }}>{card.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.010 250)" }}>{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[480px] flex items-center overflow-hidden"
        style={{ background: `linear-gradient(to right, oklch(0.08 0.015 250 / 0.97) 40%, oklch(0.08 0.015 250 / 0.6) 100%), url(${HERO_BG}) center/cover no-repeat` }}
      >
        <div className="container py-16 lg:py-20 relative z-10">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "oklch(0.65 0.20 220 / 0.15)", border: "1px solid oklch(0.65 0.20 220 / 0.3)", color: "oklch(0.65 0.20 220)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.70 0.18 160)" }} />
              Canlı Piyasa Verileri
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 250)" }}>
              Türkiye'nin<br />
              <span style={{ color: "oklch(0.65 0.20 220)" }}>Borsa Platformu</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.70 0.010 250)" }}>
              BIST hisse senetleri, kripto paralar ve döviz kurlarını CollectAPI ile canlı takip edin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/bist">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.20 220), oklch(0.55 0.22 240))", color: "white", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 0 20px oklch(0.65 0.20 220 / 0.4)" }}
                >
                  <BarChart2 className="w-4 h-4" /> BIST Hisseler <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link href="/analiz">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: "oklch(0.70 0.18 160 / 0.15)", border: "1px solid oklch(0.70 0.18 160 / 0.3)", color: "oklch(0.70 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <TrendingUp className="w-4 h-4" /> Piyasa Analizi
                </div>
              </Link>
            </div>
          </div>
        </div>
        <MarketStatsBar />
      </section>

      {/* Main Content */}
      <div className="container py-8">
        {/* Top Stocks + Market Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MarketCards />
          </div>
          <div>
            <TopStocks />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
              Tüm Piyasalar Tek Platformda
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link key={f.href} href={f.href}>
                  <div
                    className="rounded-xl p-5 h-full transition-all hover:scale-[1.02] group"
                    style={{ background: "oklch(0.12 0.015 250)", border: "1px solid oklch(0.22 0.012 250)", cursor: "pointer" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "oklch(0.65 0.20 220 / 0.12)" }}>
                      <Icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.010 250)" }}>{f.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: f.color }}>
                      İncele <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Activity, title: "Canlı Veriler", desc: "CollectAPI altyapısıyla anlık döviz, altın ve hisse fiyatları" },
            { icon: Globe, title: "Tüm Piyasalar", desc: "BIST, kripto, döviz ve emtia tek platformda" },
            { icon: Shield, title: "Güvenilir Kaynak", desc: "Lisanslı veri sağlayıcılardan doğrulanmış bilgi" },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "oklch(0.11 0.015 250)", border: "1px solid oklch(0.18 0.012 250)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.65 0.20 220 / 0.15)" }}>
                  <Icon className="w-4 h-4" style={{ color: "oklch(0.65 0.20 220)" }} />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 250)" }}>{b.title}</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.010 250)" }}>{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
