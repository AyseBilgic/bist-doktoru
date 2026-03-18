"use client";

/**
 * BIST Doktoru - Ana Sayfa (Next.js)
 * Canlı piyasa özeti, döviz kurları, kripto ve BIST widget'ları
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart2,
  Bitcoin,
  TrendingUp,
  ArrowRight,
  Activity,
  Globe,
  Shield,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import type { TCMBRate, CryptoData } from "@/types";

export default function Home() {
  const [tcmbRates, setTcmbRates] = useState<TCMBRate[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [tcmbRes, binanceRes] = await Promise.allSettled([
        fetch("/api/tcmb"),
        fetch("/api/binance"),
      ]);

      if (tcmbRes.status === "fulfilled" && tcmbRes.value.ok) {
        const data = await tcmbRes.value.json();
        if (data.rates) setTcmbRates(data.rates.slice(0, 6));
      }

      if (binanceRes.status === "fulfilled" && binanceRes.value.ok) {
        const data = await binanceRes.value.json();
        if (data.data) setCryptoData(data.data.slice(0, 6));
      }

      setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
    } catch (err) {
      console.error("Market data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  const MAIN_CURRENCIES = ["USD", "EUR", "GBP", "CHF", "JPY", "SAR"];

  const filteredRates = tcmbRates.filter((r) =>
    MAIN_CURRENCIES.includes(r.code)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full pulse-glow"
            style={{ background: "hsl(142, 71%, 45%)" }}
          />
          <span
            className="text-xs font-mono"
            style={{
              color: "hsl(142, 71%, 45%)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            CANLI VERİLER
          </span>
          {lastUpdate && (
            <span
              className="text-xs ml-auto"
              style={{
                color: "hsl(215, 20%, 50%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Son güncelleme: {lastUpdate}
            </span>
          )}
          <button
            onClick={fetchMarketData}
            className="ml-2 p-1 rounded hover:opacity-80 transition-opacity"
            style={{ color: "hsl(217, 91%, 60%)" }}
            title="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(210, 40%, 95%)",
          }}
        >
          Türkiye&apos;nin Finans Merkezi
        </h1>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          BIST hisseleri, kripto paralar ve döviz kurları tek platformda.
          TCMB, Binance ve Collect API ile güçlendirilmiş.
        </p>
      </div>

      {/* TCMB Döviz Kurları */}
      {filteredRates.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(210, 40%, 95%)",
            }}
          >
            <DollarSign
              className="w-5 h-5"
              style={{ color: "hsl(217, 91%, 60%)" }}
            />
            TCMB Döviz Kurları
            <span
              className="text-xs px-2 py-0.5 rounded ml-2"
              style={{
                background: "hsl(217, 91%, 60%, 0.12)",
                color: "hsl(217, 91%, 60%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              TCMB Resmi
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredRates.map((rate) => (
              <div
                key={rate.code}
                className="rounded-xl p-3"
                style={{
                  background: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                }}
              >
                <div
                  className="text-xs font-mono mb-1"
                  style={{
                    color: "hsl(215, 20%, 55%)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {rate.code}/TRY
                </div>
                <div
                  className="text-lg font-bold font-mono"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "hsl(210, 40%, 90%)",
                  }}
                >
                  ₺{rate.selling.toFixed(4)}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "hsl(215, 20%, 50%)" }}
                >
                  Alış: ₺{rate.buying.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kripto Özeti */}
      {cryptoData.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(210, 40%, 95%)",
            }}
          >
            <Bitcoin
              className="w-5 h-5"
              style={{ color: "hsl(45, 100%, 50%)" }}
            />
            Kripto Piyasası
            <span
              className="text-xs px-2 py-0.5 rounded ml-2"
              style={{
                background: "hsl(45, 100%, 50%, 0.12)",
                color: "hsl(45, 100%, 50%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Binance
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cryptoData.map((crypto) => (
              <div
                key={crypto.symbol}
                className="rounded-xl p-3"
                style={{
                  background: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                }}
              >
                <div
                  className="text-xs font-mono mb-1"
                  style={{
                    color: "hsl(215, 20%, 55%)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {crypto.symbol.replace("USDT", "")}
                </div>
                <div
                  className="text-sm font-bold font-mono"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "hsl(210, 40%, 90%)",
                  }}
                >
                  ${crypto.priceUSD.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </div>
                <div
                  className="flex items-center gap-0.5 text-xs mt-1"
                  style={{
                    color:
                      crypto.change24h >= 0
                        ? "hsl(142, 71%, 45%)"
                        : "hsl(0, 84%, 60%)",
                  }}
                >
                  {crypto.change24h >= 0 ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {Math.abs(crypto.change24h).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TradingView Market Overview */}
      <div className="mb-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "hsl(210, 40%, 95%)",
          }}
        >
          Piyasa Genel Görünümü
        </h2>
        <div className="tv-widget-container" style={{ height: "400px" }}>
          <TradingViewWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={{
              colorTheme: "dark",
              dateRange: "12M",
              showChart: true,
              locale: "tr",
              largeChartUrl: "",
              isTransparent: true,
              showSymbolLogo: true,
              showFloatingTooltip: false,
              width: "100%",
              height: "100%",
              tabs: [
                {
                  title: "BIST",
                  symbols: [
                    { s: "BIST:XU100", d: "BIST 100" },
                    { s: "BIST:THYAO", d: "Türk Hava Yolları" },
                    { s: "BIST:GARAN", d: "Garanti BBVA" },
                    { s: "BIST:ASELS", d: "Aselsan" },
                    { s: "BIST:EREGL", d: "Ereğli" },
                  ],
                },
                {
                  title: "Kripto",
                  symbols: [
                    { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
                    { s: "BINANCE:ETHUSDT", d: "Ethereum" },
                    { s: "BINANCE:BNBUSDT", d: "BNB" },
                    { s: "BINANCE:SOLUSDT", d: "Solana" },
                  ],
                },
                {
                  title: "Döviz",
                  symbols: [
                    { s: "FX_IDC:USDTRY", d: "USD/TRY" },
                    { s: "FX_IDC:EURTRY", d: "EUR/TRY" },
                    { s: "FX_IDC:GBPTRY", d: "GBP/TRY" },
                  ],
                },
              ],
            }}
            height="100%"
          />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* BIST promo */}
        <div
          className="relative rounded-xl overflow-hidden p-6"
          style={{
            background:
              "linear-gradient(135deg, hsl(222, 47%, 9%) 0%, hsl(217, 50%, 12%) 100%)",
            border: "1px solid hsl(222, 30%, 20%)",
            minHeight: "200px",
          }}
        >
          <div
            className="text-xs font-mono mb-2"
            style={{
              color: "hsl(217, 91%, 60%)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            BORSA İSTANBUL
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(210, 40%, 97%)",
            }}
          >
            BIST Hisse Senetleri
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: "hsl(215, 20%, 65%)" }}
          >
            500+ hisse senedini canlı grafikler ve teknik analiz araçlarıyla
            takip edin.
          </p>
          <Link href="/bist">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "hsl(217, 91%, 60%, 0.2)",
                border: "1px solid hsl(217, 91%, 60%, 0.4)",
                color: "hsl(217, 91%, 60%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <BarChart2 className="w-4 h-4" />
              Hisseleri İncele
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Kripto promo */}
        <div
          className="relative rounded-xl overflow-hidden p-6"
          style={{
            background:
              "linear-gradient(135deg, hsl(222, 47%, 9%) 0%, hsl(45, 30%, 10%) 100%)",
            border: "1px solid hsl(222, 30%, 20%)",
            minHeight: "200px",
          }}
        >
          <div
            className="text-xs font-mono mb-2"
            style={{
              color: "hsl(45, 100%, 50%)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            KRİPTO PARA
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(210, 40%, 97%)",
            }}
          >
            Kripto Piyasası
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: "hsl(215, 20%, 65%)" }}
          >
            Bitcoin, Ethereum ve yüzlerce kripto parayı TRY ve USD
            paritelerinde takip edin.
          </p>
          <Link href="/kripto">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "hsl(45, 100%, 50%, 0.2)",
                border: "1px solid hsl(45, 100%, 50%, 0.4)",
                color: "hsl(45, 100%, 50%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Bitcoin className="w-4 h-4" />
              Kripto Piyasası
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Activity,
            title: "Canlı Veriler",
            desc: "TCMB, Binance ve TradingView ile anlık piyasa verileri",
            color: "hsl(217, 91%, 60%)",
          },
          {
            icon: Globe,
            title: "Tüm Piyasalar",
            desc: "BIST, kripto, döviz ve emtia tek platformda",
            color: "hsl(142, 71%, 45%)",
          },
          {
            icon: Shield,
            title: "Güvenilir Kaynak",
            desc: "TCMB resmi verileri ve Binance API ile doğrulanmış bilgi",
            color: "hsl(189, 100%, 42%)",
          },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                background: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(222, 30%, 16%)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${badge.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: badge.color }} />
              </div>
              <div>
                <div
                  className="font-semibold text-sm mb-0.5"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "hsl(210, 40%, 90%)",
                  }}
                >
                  {badge.title}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "hsl(215, 20%, 55%)" }}
                >
                  {badge.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
