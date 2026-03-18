/**
 * BIST Doktoru - Layout Component
 * Design: Bloomberg Terminal meets Modern Fintech
 * Dark theme, sidebar navigation, live ticker strip
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
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
  Minus,
} from "lucide-react";

// Ticker data - static representative data (TradingView provides live data in widgets)
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
    <div className="h-9 overflow-hidden border-b" style={{ borderColor: "oklch(0.22 0.012 250)", background: "oklch(0.10 0.015 250)" }}>
      <div className="ticker-track h-full flex items-center">
        {doubled.map((item, i) => (
          <div key={i} className="ticker-item text-xs">
            <span className="font-medium" style={{ color: "oklch(0.75 0.010 250)", fontFamily: "'Space Grotesk', sans-serif" }}>
              {item.symbol}
            </span>
            <span className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.90 0.005 250)" }}>
              {item.price}
            </span>
            <span
              className="flex items-center gap-0.5 font-mono text-xs"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: item.up ? "oklch(0.70 0.18 160)" : "oklch(0.60 0.22 25)",
              }}
            >
              {item.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {item.change}
            </span>
            <span style={{ color: "oklch(0.30 0.012 250)", margin: "0 0.5rem" }}>|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "oklch(0 0 0 / 0.7)" }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "oklch(0.10 0.015 250)",
          borderRight: "1px solid oklch(0.20 0.012 250)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "oklch(0.20 0.012 250)" }}>
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.20 220), oklch(0.75 0.18 195))",
                boxShadow: "0 0 16px oklch(0.65 0.20 220 / 0.4)",
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
                BIST
              </div>
              <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.65 0.20 220)" }}>
                DOKTORU
              </div>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded" style={{ color: "oklch(0.60 0.010 250)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market status */}
        <div className="px-4 py-3 border-b" style={{ borderColor: "oklch(0.20 0.012 250)" }}>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "oklch(0.70 0.18 160)" }} />
            <span style={{ color: "oklch(0.70 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}>
              Piyasa Açık
            </span>
            <span className="ml-auto" style={{ color: "oklch(0.50 0.010 250)", fontFamily: "'JetBrains Mono', monospace" }}>
              {new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="nav-link"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.65 0.20 220 / 0.12)",
                          color: "oklch(0.65 0.20 220)",
                          borderLeft: "2px solid oklch(0.65 0.20 220)",
                          paddingLeft: "calc(0.75rem - 2px)",
                        }
                      : {}
                  }
                  onClick={onClose}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "oklch(0.20 0.012 250)" }}>
          <div className="text-xs space-y-1" style={{ color: "oklch(0.45 0.010 250)" }}>
            <div>© 2025 BIST Doktoru</div>
            <div>Veriler TradingView ile sunulmaktadır</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.08 0.015 250)" }}>
      {/* Ticker Strip */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <TickerStrip />
      </div>

      {/* Mobile top bar */}
      <div
        className="fixed top-9 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden"
        style={{
          background: "oklch(0.10 0.015 250)",
          borderBottom: "1px solid oklch(0.20 0.012 250)",
        }}
      >
        <button onClick={() => setSidebarOpen(true)} style={{ color: "oklch(0.65 0.010 250)" }}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.65 0.20 220), oklch(0.75 0.18 195))" }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 250)" }}>
            BIST <span style={{ color: "oklch(0.65 0.20 220)" }}>DOKTORU</span>
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main
        className="flex-1 lg:ml-64 mt-9 lg:mt-9"
        style={{ paddingTop: "2.5rem" }}
      >
        <div className="lg:hidden" style={{ height: "3rem" }} />
        {children}
      </main>
    </div>
  );
}
