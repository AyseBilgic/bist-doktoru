"use client";

/**
 * BIST Doktoru - Döviz Kurları Sayfası (Next.js)
 * TCMB API entegrasyonu
 */
import { useState, useEffect } from "react";
import { Globe, RefreshCw, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

interface TCMBRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  effectiveBuying: number;
  effectiveSelling: number;
  unit: number;
  date: string;
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", CHF: "🇨🇭", JPY: "🇯🇵",
  SAR: "🇸🇦", AUD: "🇦🇺", CAD: "🇨🇦", NOK: "🇳🇴", SEK: "🇸🇪",
  DKK: "🇩🇰", KWD: "🇰🇼", CNY: "🇨🇳", PKR: "🇵🇰", QAR: "🇶🇦",
  BGN: "🇧🇬", RON: "🇷🇴", RUB: "🇷🇺", IRR: "🇮🇷", AZN: "🇦🇿",
};

const FEATURED_PAIRS = [
  { symbol: "FX_IDC:USDTRY", label: "USD/TRY" },
  { symbol: "FX_IDC:EURTRY", label: "EUR/TRY" },
  { symbol: "FX_IDC:GBPTRY", label: "GBP/TRY" },
  { symbol: "FX:EURUSD", label: "EUR/USD" },
  { symbol: "FX:GBPUSD", label: "GBP/USD" },
  { symbol: "FX:USDJPY", label: "USD/JPY" },
];

export default function DovizPage() {
  const [rates, setRates] = useState<TCMBRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [selectedPair, setSelectedPair] = useState("FX_IDC:USDTRY");
  const [prevRates, setPrevRates] = useState<Record<string, number>>({});

  const fetchRates = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const url = forceRefresh ? "/api/tcmb?refresh=true" : "/api/tcmb";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.rates && data.rates.length > 0) {
          // Önceki kurları kaydet (değişim göstergesi için)
          const prev: Record<string, number> = {};
          rates.forEach((r) => { prev[r.code] = r.selling; });
          setPrevRates(prev);

          setRates(data.rates);
          setDate(data.date || "");
          setSource(data.source || "TCMB");
          setIsFallback(data.fallback || false);
          setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
        }
      }
    } catch (err) {
      console.error("TCMB API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(() => fetchRates(), 15 * 60 * 1000); // 15 dakikada bir
    return () => clearInterval(interval);
  }, []);

  const getChangeIndicator = (code: string, currentSelling: number) => {
    const prev = prevRates[code];
    if (!prev) return null;
    if (currentSelling > prev) return "up";
    if (currentSelling < prev) return "down";
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5" style={{ color: "hsl(142, 71%, 45%)" }} />
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
            >
              Döviz Kurları
            </h1>
            <span
              className="text-xs px-2 py-0.5 rounded ml-2"
              style={{
                background: isFallback ? "hsl(45, 100%, 50%, 0.12)" : "hsl(142, 71%, 45%, 0.12)",
                color: isFallback ? "hsl(45, 100%, 50%)" : "hsl(142, 71%, 45%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {isFallback ? "Tahmini" : "TCMB Resmi"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {date && (
              <span
                className="text-xs"
                style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {date}
              </span>
            )}
            {lastUpdate && (
              <span
                className="text-xs"
                style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {lastUpdate}
              </span>
            )}
            <button
              onClick={() => fetchRates(true)}
              className="p-1.5 rounded hover:opacity-80 transition-opacity"
              style={{ color: "hsl(142, 71%, 45%)", background: "hsl(142, 71%, 45%, 0.1)" }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          {source || "Türkiye Cumhuriyet Merkez Bankası resmi döviz kurları"}
        </p>
        {isFallback && (
          <div
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs"
            style={{
              background: "hsl(45, 100%, 50%, 0.08)",
              border: "1px solid hsl(45, 100%, 50%, 0.2)",
              color: "hsl(45, 100%, 50%)",
            }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            TCMB servisine şu an erişilemiyor. Tahmini veriler gösteriliyor.
          </div>
        )}
      </div>

      {/* Featured Pairs - TradingView */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          {FEATURED_PAIRS.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => setSelectedPair(pair.symbol)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: selectedPair === pair.symbol ? "hsl(142, 71%, 45%, 0.2)" : "hsl(222, 47%, 9%)",
                border: `1px solid ${selectedPair === pair.symbol ? "hsl(142, 71%, 45%, 0.4)" : "hsl(222, 30%, 18%)"}`,
                color: selectedPair === pair.symbol ? "hsl(142, 71%, 45%)" : "hsl(215, 20%, 60%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {pair.label}
            </button>
          ))}
        </div>
        <div className="tv-widget-container" style={{ height: "400px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
            config={{
              autosize: true,
              symbol: selectedPair,
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

      {/* TCMB Rates Table */}
      <div>
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          TCMB Döviz Kurları
        </h2>

        {loading && rates.length === 0 ? (
          <div className="flex items-center justify-center py-12" style={{ color: "hsl(215, 20%, 55%)" }}>
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Veriler yükleniyor...</span>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(222, 30%, 18%)" }}>
            <div
              className="grid grid-cols-6 px-5 py-3 text-xs font-semibold"
              style={{
                background: "hsl(222, 47%, 9%)",
                borderBottom: "1px solid hsl(222, 30%, 18%)",
                color: "hsl(215, 20%, 55%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span className="col-span-2">Para Birimi</span>
              <span className="text-right">Birim</span>
              <span className="text-right">Döviz Alış</span>
              <span className="text-right">Döviz Satış</span>
              <span className="text-right">Efektif Satış</span>
            </div>
            {rates.map((rate, i) => {
              const changeDir = getChangeIndicator(rate.code, rate.selling);
              return (
                <div
                  key={rate.code}
                  className="grid grid-cols-6 px-5 py-3 transition-all hover:bg-white/5"
                  style={{
                    borderBottom: i < rates.length - 1 ? "1px solid hsl(222, 30%, 13%)" : "none",
                    background: i % 2 === 0 ? "hsl(222, 47%, 7%)" : "hsl(222, 47%, 7.5%)",
                  }}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-lg">{CURRENCY_FLAGS[rate.code] || "🏳️"}</span>
                    <div>
                      <div
                        className="font-bold text-xs"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}
                      >
                        {rate.code}
                      </div>
                      <div className="text-xs" style={{ color: "hsl(215, 20%, 50%)" }}>
                        {rate.name}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-right text-xs font-mono flex items-center justify-end"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 60%)" }}
                  >
                    {rate.unit}
                  </div>
                  <div
                    className="text-right text-xs font-mono flex items-center justify-end"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(142, 71%, 45%)" }}
                  >
                    {rate.buying > 0 ? `₺${rate.buying.toFixed(4)}` : "—"}
                  </div>
                  <div className="text-right flex items-center justify-end gap-1">
                    <span
                      className="text-xs font-mono"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: changeDir === "up"
                          ? "hsl(142, 71%, 45%)"
                          : changeDir === "down"
                          ? "hsl(0, 84%, 60%)"
                          : "hsl(210, 40%, 88%)",
                      }}
                    >
                      {rate.selling > 0 ? `₺${rate.selling.toFixed(4)}` : "—"}
                    </span>
                    {changeDir === "up" && <ChevronUp className="w-3 h-3" style={{ color: "hsl(142, 71%, 45%)" }} />}
                    {changeDir === "down" && <ChevronDown className="w-3 h-3" style={{ color: "hsl(0, 84%, 60%)" }} />}
                  </div>
                  <div
                    className="text-right text-xs font-mono flex items-center justify-end"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 65%)" }}
                  >
                    {rate.effectiveSelling > 0 ? `₺${rate.effectiveSelling.toFixed(4)}` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forex Screener */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
        >
          Döviz Tarayıcı
        </h2>
        <div className="tv-widget-container" style={{ height: "450px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              width: "100%",
              height: "100%",
              defaultColumn: "overview",
              defaultScreen: "general",
              market: "forex",
              showToolbar: true,
              colorTheme: "dark",
              locale: "tr",
              isTransparent: true,
            }}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
