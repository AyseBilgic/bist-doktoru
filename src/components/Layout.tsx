"use client";

/**
 * BIST Doktoru - Layout Component (Next.js)
 * Design: Bloomberg Terminal meets Modern Fintech
 * Dark theme, sidebar navigation, live ticker strip
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Bitcoin,
  TrendingUp,
  Briefcase,
  Info,
  Home,
  Menu,
  X,
  Activity,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Ticker data - static representative data (will be updated via API)
const TICKER_DATA = [
  { symbol: "BIST100", price: "9.847,23", change: "+1,24%", up: true },
  { symbol: "THYAO", price: "₺312,50", change: "+2,15%", up: true },
  { symbol: "GARAN", price: "₺178,90", change: "-0,83%", up: false },
  { symbol: "ASELS", price: "₺89,45", change: "+3,20%", up: true },
  { symbol: "EREGL", price: "₺56,70", change: "-1,45%", up: false },
  { symbol: "SISE", price: "₺43,20", change: "+0,47%", up: true },
  { symbol: "KCHOL", price: "₺234,60", change: "+1,89%", up: true },
  { symbol: "AKBNK", price: "₺89,30", change: "-0,22%", up: false },
  { symbol: "BTC/TRY", price: "₺3.421.500", change: "+2,87%", up: true },
  { symbol: "ETH/TRY", price: "₺183.400", change: "+1,53%", up: true },
  { symbol: "USD/TRY", price: "₺38,42", change: "+0,12%", up: true },
  { symbol: "EUR/TRY", price: "₺41,85", change: "-0,08%", up: false },
  { symbol: "GOLD/TRY", price: "₺4.125", change: "+0,65%", up: true },
  { symbol: "BRENT", price: "$78,45", change: "-0,34%", up: false },
  { symbol: "ISCTR", price: "₺24,56", change: "+1,12%", up: true },
  { symbol: "TUPRS", price: "₺198,30", change: "-2,10%", up: false },
];

const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/bist", label: "BIST Hisseler", icon: BarChart2 },
  { href: "/kripto", label: "Kripto Para", icon: Bitcoin },
  { href: "/analiz", label: "Piyasa Analizi", icon: TrendingUp },
  { href: "/portfoy", label: "Portföy Takip", icon: Briefcase },
  { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
];

function TickerStrip() {
  const doubled = [...TICKER_DATA, ...TICKER_DATA];
  return (
    <div
      className="h-9 overflow-hidden border-b"
      style={{
        borderColor: "hsl(222, 30%, 18%)",
        background: "hsl(222, 47%, 7%)",
      }}
    >
      <div
        className="ticker-animate h-full flex items-center whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-3 text-xs">
            <span
              className="font-medium"
              style={{
                color: "hsl(215, 20%, 70%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {item.symbol}
            </span>
            <span
              className="font-mono"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "hsl(210, 40%, 90%)",
              }}
            >
              {item.price}
            </span>
            <span
              className="flex items-center gap-0.5 font-mono text-xs"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: item.up ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
              }}
            >
              {item.up ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {item.change}
            </span>
            <span
              style={{ color: "hsl(222, 30%, 30%)", margin: "0 0.25rem" }}
            >
              |
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "hsl(222, 47%, 7%)",
          borderRight: "1px solid hsl(222, 30%, 18%)",
          top: "2.25rem",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ borderColor: "hsl(222, 30%, 18%)" }}
        >
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(189, 100%, 42%))",
                boxShadow: "0 0 16px hsl(217, 91%, 60%, 0.4)",
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className="font-bold text-sm leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "hsl(210, 40%, 95%)",
                }}
              >
                BIST
              </div>
              <div
                className="font-bold text-sm leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "hsl(217, 91%, 60%)",
                }}
              >
                DOKTORU
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded"
            style={{ color: "hsl(215, 20%, 60%)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market status */}
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: "hsl(222, 30%, 18%)" }}
        >
          <div className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full pulse-glow"
              style={{ background: "hsl(142, 71%, 45%)" }}
            />
            <span
              style={{
                color: "hsl(142, 71%, 45%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Piyasa Açık
            </span>
            <span
              className="ml-auto"
              style={{
                color: "hsl(215, 20%, 50%)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <div
                  className="nav-link"
                  style={
                    isActive
                      ? {
                          background: "hsl(217, 91%, 60%, 0.12)",
                          color: "hsl(217, 91%, 60%)",
                          borderLeft: "2px solid hsl(217, 91%, 60%)",
                          paddingLeft: "calc(0.75rem - 2px)",
                        }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* API Status */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "hsl(222, 30%, 18%)" }}
        >
          <div className="text-xs space-y-1.5">
            <div
              className="font-semibold mb-2"
              style={{
                color: "hsl(215, 20%, 55%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Veri Kaynakları
            </div>
            {[
              { label: "TCMB Döviz", active: true },
              { label: "Binance Kripto", active: true },
              { label: "Collect API", active: true },
              { label: "TradingView", active: true },
            ].map((src) => (
              <div key={src.label} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: src.active
                      ? "hsl(142, 71%, 45%)"
                      : "hsl(0, 84%, 60%)",
                  }}
                />
                <span style={{ color: "hsl(215, 20%, 50%)" }}>
                  {src.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "hsl(222, 30%, 18%)" }}
        >
          <div
            className="text-xs space-y-1"
            style={{ color: "hsl(215, 20%, 45%)" }}
          >
            <div>© 2025 BIST Doktoru</div>
            <div>TCMB · Binance · TradingView</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "hsl(222, 47%, 6%)" }}
    >
      {/* Ticker Strip */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <TickerStrip />
      </div>

      {/* Mobile top bar */}
      <div
        className="fixed top-9 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden"
        style={{
          background: "hsl(222, 47%, 7%)",
          borderBottom: "1px solid hsl(222, 30%, 18%)",
        }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ color: "hsl(215, 20%, 65%)" }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(189, 100%, 42%))",
            }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-bold text-sm"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "hsl(210, 40%, 95%)",
            }}
          >
            BIST{" "}
            <span style={{ color: "hsl(217, 91%, 60%)" }}>DOKTORU</span>
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 mt-9 lg:mt-9" style={{ paddingTop: "2.5rem" }}>
        <div className="lg:hidden" style={{ height: "3rem" }} />
        {children}
      </main>
    </div>
  );
}
