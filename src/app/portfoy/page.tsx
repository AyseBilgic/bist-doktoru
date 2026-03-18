"use client";

/**
 * BIST Doktoru - Portföy Takip Sayfası (Next.js)
 */
import { useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Calculator,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  PieChart,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PortfolioItem = {
  id: string;
  symbol: string;
  name: string;
  type: "hisse" | "kripto";
  quantity: number;
  avgCost: number;
  currentPrice: number;
};

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: "1", symbol: "THYAO", name: "Türk Hava Yolları", type: "hisse", quantity: 100, avgCost: 280, currentPrice: 312.5 },
  { id: "2", symbol: "GARAN", name: "Garanti BBVA", type: "hisse", quantity: 200, avgCost: 165, currentPrice: 178.9 },
  { id: "3", symbol: "ASELS", name: "Aselsan", type: "hisse", quantity: 150, avgCost: 82, currentPrice: 89.45 },
  { id: "4", symbol: "BTC", name: "Bitcoin", type: "kripto", quantity: 0.05, avgCost: 2800000, currentPrice: 3421500 },
  { id: "5", symbol: "ETH", name: "Ethereum", type: "kripto", quantity: 0.5, avgCost: 105000, currentPrice: 124700 },
];

const COLORS_HEX = ["#2962FF", "#00C896", "#F7931A", "#7B61FF", "#FF4757", "#00D4FF"];

export default function PortfoyPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"portfoy" | "hesap">("portfoy");
  const [newItem, setNewItem] = useState({
    symbol: "",
    name: "",
    type: "hisse" as "hisse" | "kripto",
    quantity: "",
    avgCost: "",
    currentPrice: "",
  });
  const [calcType, setCalcType] = useState<"kar-zarar" | "hedef-fiyat" | "lot">("kar-zarar");
  const [calcInputs, setCalcInputs] = useState({
    buyPrice: "",
    sellPrice: "",
    quantity: "",
    targetReturn: "",
    lotSize: "",
    pricePerLot: "",
  });

  const stats = useMemo(() => {
    let totalCost = 0;
    let totalValue = 0;
    portfolio.forEach((item) => {
      totalCost += item.quantity * item.avgCost;
      totalValue += item.quantity * item.currentPrice;
    });
    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    return { totalCost, totalValue, totalPnl, totalPnlPct };
  }, [portfolio]);

  const pieData = portfolio.map((item) => ({
    name: item.symbol,
    value: item.quantity * item.currentPrice,
  }));

  const addItem = () => {
    if (!newItem.symbol || !newItem.quantity || !newItem.avgCost || !newItem.currentPrice) return;
    setPortfolio([
      ...portfolio,
      {
        id: Date.now().toString(),
        symbol: newItem.symbol.toUpperCase(),
        name: newItem.name || newItem.symbol.toUpperCase(),
        type: newItem.type,
        quantity: parseFloat(newItem.quantity),
        avgCost: parseFloat(newItem.avgCost),
        currentPrice: parseFloat(newItem.currentPrice),
      },
    ]);
    setNewItem({ symbol: "", name: "", type: "hisse", quantity: "", avgCost: "", currentPrice: "" });
    setShowAddForm(false);
  };

  const removeItem = (id: string) => setPortfolio(portfolio.filter((p) => p.id !== id));

  const calcResults = useMemo(() => {
    if (calcType === "kar-zarar") {
      const buy = parseFloat(calcInputs.buyPrice) || 0;
      const sell = parseFloat(calcInputs.sellPrice) || 0;
      const qty = parseFloat(calcInputs.quantity) || 0;
      const pnl = (sell - buy) * qty;
      const pnlPct = buy > 0 ? ((sell - buy) / buy) * 100 : 0;
      return { pnl, pnlPct, totalBuy: buy * qty, totalSell: sell * qty };
    }
    if (calcType === "hedef-fiyat") {
      const buy = parseFloat(calcInputs.buyPrice) || 0;
      const targetRet = parseFloat(calcInputs.targetReturn) || 0;
      const targetPrice = buy * (1 + targetRet / 100);
      return { targetPrice };
    }
    if (calcType === "lot") {
      const lotSize = parseFloat(calcInputs.lotSize) || 0;
      const pricePerLot = parseFloat(calcInputs.pricePerLot) || 0;
      const total = lotSize * pricePerLot;
      return { total };
    }
    return {};
  }, [calcType, calcInputs]);

  const inputStyle = {
    background: "hsl(222, 47%, 10%)",
    border: "1px solid hsl(222, 30%, 20%)",
    color: "hsl(210, 40%, 90%)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5" style={{ color: "hsl(217, 91%, 60%)" }} />
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 95%)" }}
          >
            Portföy Takip
          </h1>
        </div>
        <p style={{ color: "hsl(215, 20%, 60%)" }}>
          Hisse ve kripto portföyünüzü yönetin, kâr/zarar hesaplayın
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "portfoy", label: "Portföyüm", icon: Briefcase },
          { key: "hesap", label: "Hesap Makinesi", icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "portfoy" | "hesap")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  activeTab === tab.key
                    ? "hsl(217, 91%, 60%, 0.2)"
                    : "hsl(222, 47%, 9%)",
                border: `1px solid ${
                  activeTab === tab.key
                    ? "hsl(217, 91%, 60%, 0.4)"
                    : "hsl(222, 30%, 18%)"
                }`,
                color:
                  activeTab === tab.key
                    ? "hsl(217, 91%, 60%)"
                    : "hsl(215, 20%, 60%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "portfoy" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Toplam Maliyet", value: `₺${stats.totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`, color: "hsl(215, 20%, 60%)" },
              { label: "Güncel Değer", value: `₺${stats.totalValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`, color: "hsl(217, 91%, 60%)" },
              {
                label: "Kâr / Zarar",
                value: `${stats.totalPnl >= 0 ? "+" : ""}₺${stats.totalPnl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`,
                color: stats.totalPnl >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
              },
              {
                label: "Getiri %",
                value: `${stats.totalPnlPct >= 0 ? "+" : ""}${stats.totalPnlPct.toFixed(2)}%`,
                color: stats.totalPnlPct >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4"
                style={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)" }}
              >
                <div className="text-xs mb-1" style={{ color: "hsl(215, 20%, 50%)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </div>
                <div className="text-lg font-bold font-mono" style={{ color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Table */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}>
                  Varlıklarım
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                  style={{
                    background: "hsl(217, 91%, 60%, 0.15)",
                    border: "1px solid hsl(217, 91%, 60%, 0.3)",
                    color: "hsl(217, 91%, 60%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Varlık Ekle
                </button>
              </div>

              {showAddForm && (
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 20%)" }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <input placeholder="Sembol (THYAO)" value={newItem.symbol} onChange={(e) => setNewItem({ ...newItem, symbol: e.target.value })} style={inputStyle} />
                    <input placeholder="İsim" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "hisse" | "kripto" })}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="hisse">Hisse</option>
                      <option value="kripto">Kripto</option>
                    </select>
                    <input placeholder="Adet" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} style={inputStyle} />
                    <input placeholder="Alış Fiyatı" type="number" value={newItem.avgCost} onChange={(e) => setNewItem({ ...newItem, avgCost: e.target.value })} style={inputStyle} />
                    <input placeholder="Güncel Fiyat" type="number" value={newItem.currentPrice} onChange={(e) => setNewItem({ ...newItem, currentPrice: e.target.value })} style={inputStyle} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addItem}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "hsl(217, 91%, 60%)", color: "white", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Ekle
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "hsl(222, 30%, 18%)", color: "hsl(215, 20%, 60%)", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid hsl(222, 30%, 18%)" }}
              >
                <div
                  className="grid grid-cols-6 px-4 py-2 text-xs font-medium"
                  style={{
                    background: "hsl(222, 47%, 9%)",
                    borderBottom: "1px solid hsl(222, 30%, 15%)",
                    color: "hsl(215, 20%, 50%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <span className="col-span-2">Varlık</span>
                  <span className="text-right">Adet</span>
                  <span className="text-right">Maliyet</span>
                  <span className="text-right">K/Z</span>
                  <span className="text-right">İşlem</span>
                </div>
                {portfolio.map((item, i) => {
                  const cost = item.quantity * item.avgCost;
                  const value = item.quantity * item.currentPrice;
                  const pnl = value - cost;
                  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-6 px-4 py-3"
                      style={{
                        borderBottom: i < portfolio.length - 1 ? "1px solid hsl(222, 30%, 13%)" : "none",
                        background: i % 2 === 0 ? "hsl(222, 47%, 7%)" : "hsl(222, 47%, 7.5%)",
                      }}
                    >
                      <div className="col-span-2">
                        <div className="font-bold text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}>
                          {item.symbol}
                        </div>
                        <div className="text-xs" style={{ color: "hsl(215, 20%, 50%)" }}>
                          {item.type === "hisse" ? "Hisse" : "Kripto"}
                        </div>
                      </div>
                      <div className="text-right text-xs font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(210, 40%, 80%)" }}>
                        {item.quantity}
                      </div>
                      <div className="text-right text-xs font-mono" style={{ fontFamily: "'JetBrains Mono', monospace", color: "hsl(215, 20%, 65%)" }}>
                        ₺{cost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs font-mono"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: pnl >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                          }}
                        >
                          {pnl >= 0 ? "+" : ""}₺{pnl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
                        </div>
                        <div
                          className="text-xs font-mono flex items-center justify-end gap-0.5"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: pnlPct >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
                          }}
                        >
                          {pnlPct >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {Math.abs(pnlPct).toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded hover:opacity-80 transition-opacity"
                          style={{ color: "hsl(0, 84%, 60%)" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie Chart */}
            <div>
              <h2 className="font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}>
                <PieChart className="w-4 h-4 inline mr-2" style={{ color: "hsl(217, 91%, 60%)" }} />
                Dağılım
              </h2>
              <div
                className="rounded-xl p-4"
                style={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)" }}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_HEX[index % COLORS_HEX.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`₺${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`, "Değer"]}
                      contentStyle={{
                        background: "hsl(222, 47%, 10%)",
                        border: "1px solid hsl(222, 30%, 20%)",
                        borderRadius: "0.5rem",
                        color: "hsl(210, 40%, 90%)",
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS_HEX[index % COLORS_HEX.length] }} />
                        <span style={{ color: "hsl(215, 20%, 65%)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ color: "hsl(210, 40%, 80%)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {((item.value / stats.totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "hesap" && (
        <div className="max-w-2xl">
          <h2 className="font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(210, 40%, 90%)" }}>
            <Calculator className="w-4 h-4 inline mr-2" style={{ color: "hsl(217, 91%, 60%)" }} />
            Yatırım Hesap Makinesi
          </h2>

          {/* Calc Type Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "kar-zarar", label: "Kâr/Zarar" },
              { key: "hedef-fiyat", label: "Hedef Fiyat" },
              { key: "lot", label: "Lot Hesabı" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setCalcType(t.key as typeof calcType)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: calcType === t.key ? "hsl(217, 91%, 60%, 0.2)" : "hsl(222, 47%, 9%)",
                  border: `1px solid ${calcType === t.key ? "hsl(217, 91%, 60%, 0.4)" : "hsl(222, 30%, 18%)"}`,
                  color: calcType === t.key ? "hsl(217, 91%, 60%)" : "hsl(215, 20%, 60%)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)" }}
          >
            {calcType === "kar-zarar" && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Alış Fiyatı</label>
                    <input type="number" placeholder="₺0.00" value={calcInputs.buyPrice} onChange={(e) => setCalcInputs({ ...calcInputs, buyPrice: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Satış Fiyatı</label>
                    <input type="number" placeholder="₺0.00" value={calcInputs.sellPrice} onChange={(e) => setCalcInputs({ ...calcInputs, sellPrice: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Adet</label>
                    <input type="number" placeholder="0" value={calcInputs.quantity} onChange={(e) => setCalcInputs({ ...calcInputs, quantity: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                {"pnl" in calcResults && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: "hsl(222, 30%, 18%)" }}>
                    <div className="rounded-lg p-3" style={{ background: "hsl(222, 47%, 10%)" }}>
                      <div className="text-xs mb-1" style={{ color: "hsl(215, 20%, 55%)" }}>Kâr / Zarar</div>
                      <div className="font-mono font-bold" style={{ color: (calcResults.pnl ?? 0) >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {(calcResults.pnl ?? 0) >= 0 ? "+" : ""}₺{(calcResults.pnl ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "hsl(222, 47%, 10%)" }}>
                      <div className="text-xs mb-1" style={{ color: "hsl(215, 20%, 55%)" }}>Getiri %</div>
                      <div className="font-mono font-bold" style={{ color: (calcResults.pnlPct ?? 0) >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {(calcResults.pnlPct ?? 0) >= 0 ? "+" : ""}{(calcResults.pnlPct ?? 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {calcType === "hedef-fiyat" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Alış Fiyatı</label>
                    <input type="number" placeholder="₺0.00" value={calcInputs.buyPrice} onChange={(e) => setCalcInputs({ ...calcInputs, buyPrice: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Hedef Getiri %</label>
                    <input type="number" placeholder="10" value={calcInputs.targetReturn} onChange={(e) => setCalcInputs({ ...calcInputs, targetReturn: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                {"targetPrice" in calcResults && (
                  <div className="rounded-lg p-3 pt-2 border-t" style={{ borderColor: "hsl(222, 30%, 18%)", background: "hsl(222, 47%, 10%)" }}>
                    <div className="text-xs mb-1" style={{ color: "hsl(215, 20%, 55%)" }}>Hedef Fiyat</div>
                    <div className="font-mono font-bold text-xl" style={{ color: "hsl(217, 91%, 60%)", fontFamily: "'JetBrains Mono', monospace" }}>
                      ₺{(calcResults.targetPrice ?? 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </>
            )}

            {calcType === "lot" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Lot Adedi</label>
                    <input type="number" placeholder="0" value={calcInputs.lotSize} onChange={(e) => setCalcInputs({ ...calcInputs, lotSize: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "hsl(215, 20%, 55%)" }}>Lot Fiyatı (₺)</label>
                    <input type="number" placeholder="₺0.00" value={calcInputs.pricePerLot} onChange={(e) => setCalcInputs({ ...calcInputs, pricePerLot: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                {"total" in calcResults && (
                  <div className="rounded-lg p-3 pt-2 border-t" style={{ borderColor: "hsl(222, 30%, 18%)", background: "hsl(222, 47%, 10%)" }}>
                    <div className="text-xs mb-1" style={{ color: "hsl(215, 20%, 55%)" }}>Toplam Tutar</div>
                    <div className="font-mono font-bold text-xl" style={{ color: "hsl(217, 91%, 60%)", fontFamily: "'JetBrains Mono', monospace" }}>
                      ₺{(calcResults.total ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
