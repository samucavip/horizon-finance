import { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, Tags, PiggyBank,
  Target, Plus, X, Upload, TrendingUp, TrendingDown, AlertTriangle,
  ShoppingCart, Home, Car, Utensils, HeartPulse, GraduationCap, Plane,
  Gift, Film, Zap, Wifi, Dumbbell, PawPrint, Shirt, Coffee, Fuel,
  Wrench, Baby, Book, Music, Smartphone, DollarSign, Briefcase,
  Landmark, Receipt, Trash2, ChevronDown, ChevronRight, Check, Edit2,
  Globe, Repeat, Calendar
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Legend
} from "recharts";

/* ---------------- design tokens ---------------- */
const C = {
  ink: "#14181F",
  inkSoft: "#1E2430",
  paper: "#F5F6F2",
  paperDim: "#EAE8E1",
  line: "#DDDAD1",
  slate: "#5B6270",
  slateSoft: "#8A8F99",
  emerald: "#1F7A5C",
  emeraldSoft: "#DCEEE6",
  amber: "#C88A2E",
  amberSoft: "#F5E6CC",
  coral: "#BE4B3C",
  coralSoft: "#F4DFDA",
  steel: "#2D6E8E",
  steelSoft: "#DCE9EE",
  white: "#FFFFFF",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

const ICONS = {
  ShoppingCart, Home, Car, Utensils, HeartPulse, GraduationCap, Plane,
  Gift, Film, Zap, Wifi, Dumbbell, PawPrint, Shirt, Coffee, Fuel,
  Wrench, Baby, Book, Music, Smartphone, DollarSign, Briefcase,
  Landmark, Receipt, Wallet, Repeat,
};
const ICON_NAMES = Object.keys(ICONS);

function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function monthKey(d) { return d.slice(0, 7); }
function fmt(v, ccy) {
  const s = new Intl.NumberFormat(ccy === "USD" ? "en-US" : "pt-BR", {
    style: "currency", currency: ccy, minimumFractionDigits: 2,
  }).format(v);
  return s;
}
function daysInMonth(mk) {
  const [y, m] = mk.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

/* ---------------- default seed data ---------------- */
function seed() {
  const accId1 = uid(), accId2 = uid(), cc1 = uid(), cc2 = uid();
  const catFood = uid(), catMkt = uid(), catRest = uid();
  const catHome = uid(), catTransport = uid(), catFuel = uid(), catUber = uid();
  const catHealth = uid(), catLeisure = uid(), catSub = uid(), catSalary = uid(), catOther = uid();

  const categories = [
    { id: catFood, name: "Alimentação", color: C.coral, icon: "Utensils", parentId: null, budget: 2500 },
    { id: catMkt, name: "Mercado", color: C.coral, icon: "ShoppingCart", parentId: catFood, budget: 0 },
    { id: catRest, name: "Restaurante", color: C.coral, icon: "Coffee", parentId: catFood, budget: 0 },
    { id: catHome, name: "Moradia", color: C.steel, icon: "Home", parentId: null, budget: 3200 },
    { id: catTransport, name: "Transporte", color: C.amber, icon: "Car", parentId: null, budget: 900 },
    { id: catFuel, name: "Combustível", color: C.amber, icon: "Fuel", parentId: catTransport, budget: 0 },
    { id: catUber, name: "App de transporte", color: C.amber, icon: "Car", parentId: catTransport, budget: 0 },
    { id: catHealth, name: "Saúde", color: C.emerald, icon: "HeartPulse", parentId: null, budget: 600 },
    { id: catLeisure, name: "Lazer", color: "#7C5CBF", icon: "Film", parentId: null, budget: 500 },
    { id: catSub, name: "Assinaturas", color: "#7C5CBF", icon: "Wifi", parentId: null, budget: 250 },
    { id: catSalary, name: "Salário", color: C.emerald, icon: "Briefcase", parentId: null, budget: 0 },
    { id: catOther, name: "Outros", color: C.slate, icon: "Receipt", parentId: null, budget: 300 },
  ];

  const accounts = [
    { id: accId1, name: "Nubank", country: "BR", currency: "BRL", type: "checking", initialBalance: 4200 },
    { id: accId2, name: "Chase Checking", country: "US", currency: "USD", type: "checking", initialBalance: 1800 },
    { id: cc1, name: "Nubank Cartão", country: "BR", currency: "BRL", type: "credit", initialBalance: 0, closingDay: 25, dueDay: 5, limit: 8000 },
    { id: cc2, name: "Chase Sapphire", country: "US", currency: "USD", type: "credit", initialBalance: 0, closingDay: 20, dueDay: 10, limit: 5000 },
  ];

  const today = todayISO();
  const transactions = [
    { id: uid(), accountId: accId1, date: today, description: "Salário", amount: 9800, categoryId: catSalary, type: "income", paymentMethod: "debit" },
    { id: uid(), accountId: cc1, date: today, description: "Supermercado Pão de Açúcar", amount: -412.5, categoryId: catMkt, type: "expense", paymentMethod: "credit" },
    { id: uid(), accountId: cc1, date: today, description: "iFood", amount: -68.9, categoryId: catRest, type: "expense", paymentMethod: "credit" },
    { id: uid(), accountId: accId1, date: today, description: "Aluguel", amount: -2600, categoryId: catHome, type: "expense", paymentMethod: "debit" },
    { id: uid(), accountId: accId2, date: today, description: "Salary US freelance", amount: 1200, categoryId: catSalary, type: "income", paymentMethod: "debit" },
    { id: uid(), accountId: cc2, date: today, description: "Netflix", amount: -15.49, categoryId: catSub, type: "expense", paymentMethod: "credit" },
  ];

  const goals = [
    { id: uid(), name: "Reserva de emergência", target: 30000, current: 14500, deadline: "", color: C.emerald },
    { id: uid(), name: "Viagem Europa", target: 15000, current: 3200, deadline: "", color: C.steel },
  ];

  return { accounts, categories, transactions, goals, exchangeRate: 5.4 };
}

/* ---------------- storage ---------------- */
async function loadState() {
  try {
    const res = await window.storage.get("finance-state");
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) { /* not found */ }
  return null;
}
async function saveState(state) {
  try { await window.storage.set("finance-state", JSON.stringify(state)); }
  catch (e) { console.error("save failed", e); }
}

/* ---------------- small UI atoms ---------------- */
function Card({ children, style, ...rest }) {
  return (
    <div
      style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 14, ...style }}
      {...rest}
    >{children}</div>
  );
}
function Pill({ children, bg, fg }) {
  return (
    <span style={{
      background: bg, color: fg, fontSize: 12, fontWeight: 600, padding: "3px 10px",
      borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4,
    }}>{children}</span>
  );
}
function IconBadge({ name, color, size = 18 }) {
  const Icon = ICONS[name] || Receipt;
  return (
    <div style={{
      width: size + 18, height: size + 18, borderRadius: 10, background: color + "22",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  );
}
function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#14181Fcc", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.white, borderRadius: 16, width, maxWidth: "100%", maxHeight: "88vh",
        overflowY: "auto", padding: 24,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.slate, display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 9, border: `1px solid ${C.line}`,
  fontSize: 14, fontFamily: "'IBM Plex Sans',sans-serif", color: C.ink, boxSizing: "border-box",
  background: C.paper,
};
const btnPrimary = {
  background: C.ink, color: C.white, border: "none", borderRadius: 9, padding: "10px 18px",
  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Sans',sans-serif",
};
const btnGhost = {
  background: "transparent", color: C.ink, border: `1px solid ${C.line}`, borderRadius: 9,
  padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Sans',sans-serif",
};

/* ================= MAIN APP ================= */
export default function FinanceApp() {
  const [loaded, setLoaded] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(5.4);
  const [view, setView] = useState("dashboard");
  const [month, setMonth] = useState(todayISO().slice(0, 7));

  const [showTxModal, setShowTxModal] = useState(false);
  const [showAccModal, setShowAccModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    (async () => {
      let s = await loadState();
      if (!s) { s = seed(); await saveState(s); }
      setAccounts(s.accounts); setCategories(s.categories);
      setTransactions(s.transactions); setGoals(s.goals);
      setExchangeRate(s.exchangeRate || 5.4);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveState({ accounts, categories, transactions, goals, exchangeRate });
  }, [accounts, categories, transactions, goals, exchangeRate, loaded]);

  const toBRL = (v, ccy) => (ccy === "USD" ? v * exchangeRate : v);

  const accountBalance = (accId, upTo) => {
    const acc = accounts.find(a => a.id === accId);
    if (!acc) return 0;
    const sum = transactions
      .filter(t => t.accountId === accId && (!upTo || t.date <= upTo))
      .reduce((s, t) => s + t.amount, 0);
    return acc.initialBalance + sum;
  };
  const accountProjected = (accId) => {
    const acc = accounts.find(a => a.id === accId);
    if (!acc) return 0;
    const endOfMonth = `${month}-${String(daysInMonth(month)).padStart(2, "0")}`;
    const sum = transactions
      .filter(t => t.accountId === accId && t.date <= endOfMonth)
      .reduce((s, t) => s + t.amount, 0);
    return acc.initialBalance + sum;
  };

  const totalBalanceBRL = useMemo(() =>
    accounts.reduce((s, a) => s + toBRL(accountBalance(a.id, todayISO()), a.currency), 0),
    [accounts, transactions, exchangeRate]);

  const totalProjectedBRL = useMemo(() =>
    accounts.reduce((s, a) => s + toBRL(accountProjected(a.id), a.currency), 0),
    [accounts, transactions, exchangeRate, month]);

  const monthTx = useMemo(() => transactions.filter(t => monthKey(t.date) === month), [transactions, month]);
  const income = useMemo(() => monthTx.filter(t => t.type === "income").reduce((s, t) => {
    const acc = accounts.find(a => a.id === t.accountId);
    return s + toBRL(t.amount, acc ? acc.currency : "BRL");
  }, 0), [monthTx, accounts, exchangeRate]);
  const expense = useMemo(() => monthTx.filter(t => t.type === "expense").reduce((s, t) => {
    const acc = accounts.find(a => a.id === t.accountId);
    return s + toBRL(Math.abs(t.amount), acc ? acc.currency : "BRL");
  }, 0), [monthTx, accounts, exchangeRate]);

  const categorySpent = (catId) => {
    const childIds = categories.filter(c => c.parentId === catId).map(c => c.id);
    const ids = [catId, ...childIds];
    return monthTx
      .filter(t => ids.includes(t.categoryId) && t.type === "expense" && t.date <= todayISO())
      .reduce((s, t) => {
        const acc = accounts.find(a => a.id === t.accountId);
        return s + toBRL(Math.abs(t.amount), acc ? acc.currency : "BRL");
      }, 0);
  };

  const topCategories = categories.filter(c => !c.parentId);
  const pacePct = (new Date(todayISO()).getDate()) / daysInMonth(month);

  const addTransaction = (tx) => {
    if (tx.__bulk) {
      setTransactions(prev => [...prev, ...tx.__bulk]);
      setEditingTx(null);
      return;
    }
    setTransactions(prev => editingTx
      ? prev.map(t => t.id === editingTx.id ? { ...tx, id: editingTx.id } : t)
      : [...prev, { ...tx, id: uid() }]);
    setEditingTx(null);
  };
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const addAccount = (acc) => setAccounts(prev => [...prev, { ...acc, id: uid() }]);
  const addCategory = (cat) => setCategories(prev => [...prev, { ...cat, id: uid() }]);
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
  const addGoal = (g) => setGoals(prev => [...prev, { ...g, id: uid() }]);
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  const addTransfer = ({ fromId, toId, fromAmount, toAmount, date, note }) => {
    const from = accounts.find(a => a.id === fromId);
    const to = accounts.find(a => a.id === toId);
    const pairId = uid();
    setTransactions(prev => [...prev,
      { id: uid(), accountId: fromId, date, description: note || `Transferência → ${to.name}`, amount: -Math.abs(fromAmount), categoryId: null, type: "transfer", paymentMethod: "debit", transferPairId: pairId },
      { id: uid(), accountId: toId, date, description: note || `Transferência ← ${from.name}`, amount: Math.abs(toAmount), categoryId: null, type: "transfer", paymentMethod: "debit", transferPairId: pairId },
    ]);
  };

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, fontFamily: "'IBM Plex Sans',sans-serif", color: C.slate }}>
        Carregando…
      </div>
    );
  }

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "accounts", label: "Contas", icon: Wallet },
    { key: "transactions", label: "Lançamentos", icon: Receipt },
    { key: "cards", label: "Cartões", icon: CreditCard },
    { key: "categories", label: "Categorias", icon: Tags },
    { key: "budget", label: "Orçamento", icon: PiggyBank },
    { key: "goals", label: "Metas", icon: Target },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", background: C.paper, minHeight: 640, borderRadius: 18, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{FONT_IMPORT}{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${C.steel}; outline-offset: 1px; }
        .tabular { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
      `}</style>

      <div style={{ display: "flex", minHeight: 640 }}>
        {/* Sidebar */}
        <div style={{ width: 210, background: C.ink, padding: "22px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 22px", borderBottom: "1px solid #ffffff1a", marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: C.emerald, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Landmark size={16} color={C.white} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.white, fontSize: 15 }}>Duas Praças</span>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button key={item.key} onClick={() => setView(item.key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px",
                borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 3,
                background: active ? "#ffffff14" : "transparent",
                color: active ? C.white : "#B8BCC4", fontSize: 13.5, fontWeight: 500,
                fontFamily: "'IBM Plex Sans',sans-serif", textAlign: "left",
              }}>
                <Icon size={16} />{item.label}
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "22px 26px", minWidth: 0 }}>
          {/* top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>
                {navItems.find(n => n.key === view)?.label}
              </h1>
              <div style={{ fontSize: 12.5, color: C.slateSoft, marginTop: 2 }}>Câmbio USD→BRL: {" "}
                <input type="number" step="0.01" value={exchangeRate}
                  onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
                  style={{ width: 60, border: "none", borderBottom: `1px solid ${C.line}`, background: "transparent", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                style={{ ...inputStyle, width: 150, padding: "8px 10px" }} />
              <button style={btnGhost} onClick={() => setShowTransferModal(true)}><ArrowLeftRight size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Transferir</button>
              <button style={btnPrimary} onClick={() => { setEditingTx(null); setShowTxModal(true); }}><Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Lançamento</button>
            </div>
          </div>

          {view === "dashboard" && (
            <DashboardView {...{ accounts, categories, transactions, goals, exchangeRate, month, totalBalanceBRL, totalProjectedBRL, income, expense, topCategories, categorySpent, toBRL, accountBalance }} />
          )}
          {view === "accounts" && (
            <AccountsView {...{ accounts, exchangeRate, accountBalance, accountProjected, setShowAccModal }} />
          )}
          {view === "transactions" && (
            <TransactionsView {...{ transactions, accounts, categories, month, deleteTransaction, setEditingTx, setShowTxModal, setShowImportModal }} />
          )}
          {view === "cards" && (
            <CardsView {...{ accounts, transactions, month }} />
          )}
          {view === "categories" && (
            <CategoriesView {...{ categories, setShowCatModal, deleteCategory }} />
          )}
          {view === "budget" && (
            <BudgetView {...{ topCategories, categorySpent, pacePct }} />
          )}
          {view === "goals" && (
            <GoalsView {...{ goals, setShowGoalModal, deleteGoal, setGoals }} />
          )}
        </div>
      </div>

      {showTxModal && (
        <TxModal accounts={accounts} categories={categories} editingTx={editingTx}
          onClose={() => { setShowTxModal(false); setEditingTx(null); }} onSave={(tx) => { addTransaction(tx); setShowTxModal(false); }} />
      )}
      {showAccModal && <AccModal onClose={() => setShowAccModal(false)} onSave={(a) => { addAccount(a); setShowAccModal(false); }} />}
      {showCatModal && <CatModal categories={categories} onClose={() => setShowCatModal(false)} onSave={(c) => { addCategory(c); setShowCatModal(false); }} />}
      {showGoalModal && <GoalModal onClose={() => setShowGoalModal(false)} onSave={(g) => { addGoal(g); setShowGoalModal(false); }} />}
      {showTransferModal && <TransferModal accounts={accounts} exchangeRate={exchangeRate} onClose={() => setShowTransferModal(false)} onSave={(t) => { addTransfer(t); setShowTransferModal(false); }} />}
      {showImportModal && <ImportModal accounts={accounts} categories={categories} onClose={() => setShowImportModal(false)} onImport={(rows) => { setTransactions(prev => [...prev, ...rows]); setShowImportModal(false); }} />}
    </div>
  );
}

/* ================= DASHBOARD ================= */
function DashboardView({ accounts, categories, month, totalBalanceBRL, totalProjectedBRL, income, expense, topCategories, categorySpent, toBRL, accountBalance }) {
  const pieData = topCategories.map(c => ({ name: c.name, value: categorySpent(c.id), color: c.color })).filter(d => d.value > 0.01);
  const trend = useMemo(() => {
    const out = [];
    const [y, m] = month.split("-").map(Number);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - 1 - i, 1);
      out.push({ label: d.toLocaleDateString("pt-BR", { month: "short" }), key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` });
    }
    return out;
  }, [month]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 18 }}>
        <StatCard label="Saldo total hoje" value={fmt(totalBalanceBRL, "BRL")} tone="ink" icon={Wallet} />
        <StatCard label="Saldo previsto (fim do mês)" value={fmt(totalProjectedBRL, "BRL")} tone="steel" icon={TrendingUp} />
        <StatCard label="Entradas do mês" value={fmt(income, "BRL")} tone="emerald" icon={TrendingUp} />
        <StatCard label="Saídas do mês" value={fmt(expense, "BRL")} tone="coral" icon={TrendingDown} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card style={{ padding: 18 }}>
          <SectionTitle>Contas — saldo atual</SectionTitle>
          {accounts.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.paperDim}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <IconBadge name={a.type === "credit" ? "CreditCard" in ICONS ? "CreditCard" : "Wallet" : "Landmark"} color={a.country === "BR" ? C.emerald : C.steel} size={15} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.slateSoft }}>{a.country} · {a.currency}</div>
                </div>
              </div>
              <div className="tabular" style={{ fontSize: 14, fontWeight: 600, color: accountBalance(a.id) < 0 ? C.coral : C.ink }}>
                {fmt(accountBalance(a.id), a.currency)}
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          <SectionTitle>Gastos por categoria (mês)</SectionTitle>
          {pieData.length === 0 ? <EmptyHint text="Sem despesas lançadas neste mês ainda." /> : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v, "BRL")} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, minWidth: 0 }}>
                {pieData.sort((a, b) => b.value - a.value).slice(0, 6).map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.ink }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: d.color }} />{d.name}
                    </span>
                    <span className="tabular" style={{ color: C.slate }}>{fmt(d.value, "BRL")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone, icon: Icon }) {
  const tones = {
    ink: { bg: C.ink, fg: C.white, sub: "#B8BCC4" },
    steel: { bg: C.steelSoft, fg: C.ink, sub: C.steel },
    emerald: { bg: C.emeraldSoft, fg: C.ink, sub: C.emerald },
    coral: { bg: C.coralSoft, fg: C.ink, sub: C.coral },
  };
  const t = tones[tone];
  return (
    <Card style={{ padding: 16, background: t.bg, border: tone === "ink" ? "none" : `1px solid ${C.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: tone === "ink" ? t.sub : C.slate }}>{label}</span>
        <Icon size={15} color={t.sub} />
      </div>
      <div className="tabular" style={{ fontSize: 21, fontWeight: 700, color: t.fg, marginTop: 8 }}>{value}</div>
    </Card>
  );
}
function SectionTitle({ children }) {
  return <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 12 }}>{children}</div>;
}
function EmptyHint({ text }) {
  return <div style={{ fontSize: 13, color: C.slateSoft, padding: "18px 0", textAlign: "center" }}>{text}</div>;
}

/* ================= ACCOUNTS ================= */
function AccountsView({ accounts, exchangeRate, accountBalance, accountProjected, setShowAccModal }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button style={btnGhost} onClick={() => setShowAccModal(true)}><Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Nova conta</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
        {accounts.filter(a => a.type !== "credit").map(a => (
          <Card key={a.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Pill bg={a.country === "BR" ? C.emeraldSoft : C.steelSoft} fg={a.country === "BR" ? C.emerald : C.steel}><Globe size={11} />{a.country} · {a.currency}</Pill>
              <span style={{ fontSize: 11, color: C.slateSoft, textTransform: "uppercase", letterSpacing: 0.4 }}>{a.type === "checking" ? "Conta corrente" : a.type}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 10 }}>{a.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.slate, marginBottom: 3 }}>
              <span>Saldo atual</span>
              <span className="tabular" style={{ fontWeight: 700, color: C.ink }}>{fmt(accountBalance(a.id, todayISO()), a.currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.slate }}>
              <span>Previsto fim do mês</span>
              <span className="tabular" style={{ fontWeight: 600, color: C.steel }}>{fmt(accountProjected(a.id), a.currency)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================= TRANSACTIONS ================= */
function TransactionsView({ transactions, accounts, categories, month, deleteTransaction, setEditingTx, setShowTxModal, setShowImportModal }) {
  const [filterAcc, setFilterAcc] = useState("all");
  const list = transactions
    .filter(t => monthKey(t.date) === month)
    .filter(t => filterAcc === "all" || t.accountId === filterAcc)
    .sort((a, b) => b.date.localeCompare(a.date));

  const catById = (id) => categories.find(c => c.id === id);
  const accById = (id) => accounts.find(a => a.id === id);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <select value={filterAcc} onChange={e => setFilterAcc(e.target.value)} style={{ ...inputStyle, width: 200 }}>
          <option value="all">Todas as contas</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <button style={btnGhost} onClick={() => setShowImportModal(true)}><Upload size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Importar CSV</button>
      </div>
      <Card style={{ padding: 4 }}>
        {list.length === 0 ? <EmptyHint text="Nenhum lançamento neste mês." /> : list.map(t => {
          const cat = catById(t.categoryId);
          const acc = accById(t.accountId);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderBottom: `1px solid ${C.paperDim}` }}>
              <IconBadge name={cat ? cat.icon : (t.type === "transfer" ? "Repeat" : "Receipt")} color={cat ? cat.color : C.slate} size={15} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                <div style={{ fontSize: 11.5, color: C.slateSoft }}>
                  {acc?.name} · {t.date.split("-").reverse().join("/")} {cat ? `· ${cat.name}` : ""} · {t.paymentMethod === "credit" ? "crédito" : "débito"}
                </div>
              </div>
              <div className="tabular" style={{ fontSize: 14, fontWeight: 700, color: t.amount < 0 ? C.coral : C.emerald, minWidth: 100, textAlign: "right" }}>
                {t.amount < 0 ? "-" : "+"}{fmt(Math.abs(t.amount), acc?.currency || "BRL")}
              </div>
              <button onClick={() => { setEditingTx(t); setShowTxModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}><Edit2 size={14} /></button>
              <button onClick={() => deleteTransaction(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ================= CARDS ================= */
function CardsView({ accounts, transactions, month }) {
  const cards = accounts.filter(a => a.type === "credit");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
      {cards.map(card => {
        const monthTx = transactions.filter(t => t.accountId === card.id && monthKey(t.date) === month);
        const spent = monthTx.reduce((s, t) => s + Math.abs(t.amount), 0);
        const usage = card.limit ? Math.min(100, (spent / card.limit) * 100) : 0;
        return (
          <Card key={card.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <IconBadge name="Receipt" color={card.country === "BR" ? C.emerald : C.steel} size={15} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{card.name}</div>
                  <div style={{ fontSize: 11, color: C.slateSoft }}>Fecha dia {card.closingDay} · Vence dia {card.dueDay}</div>
                </div>
              </div>
              <Pill bg={card.country === "BR" ? C.emeraldSoft : C.steelSoft} fg={card.country === "BR" ? C.emerald : C.steel}>{card.currency}</Pill>
            </div>
            <div className="tabular" style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{fmt(spent, card.currency)}</div>
            <div style={{ fontSize: 11.5, color: C.slateSoft, marginBottom: 8 }}>fatura atual · limite {fmt(card.limit || 0, card.currency)}</div>
            <div style={{ height: 7, borderRadius: 99, background: C.paperDim, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${usage}%`, background: usage > 85 ? C.coral : C.steel, borderRadius: 99 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              {monthTx.slice(0, 4).map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderTop: `1px solid ${C.paperDim}` }}>
                  <span style={{ color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{t.description}</span>
                  <span className="tabular" style={{ color: C.ink, fontWeight: 600 }}>{fmt(Math.abs(t.amount), card.currency)}</span>
                </div>
              ))}
              {monthTx.length === 0 && <EmptyHint text="Sem lançamentos na fatura deste mês." />}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ================= CATEGORIES ================= */
function CategoriesView({ categories, setShowCatModal, deleteCategory }) {
  const [open, setOpen] = useState({});
  const top = categories.filter(c => !c.parentId);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button style={btnGhost} onClick={() => setShowCatModal(true)}><Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Nova categoria</button>
      </div>
      <Card style={{ padding: 6 }}>
        {top.map(cat => {
          const children = categories.filter(c => c.parentId === cat.id);
          const isOpen = open[cat.id];
          return (
            <div key={cat.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderBottom: `1px solid ${C.paperDim}` }}>
                {children.length > 0 ? (
                  <button onClick={() => setOpen(o => ({ ...o, [cat.id]: !o[cat.id] }))} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                ) : <span style={{ width: 15 }} />}
                <IconBadge name={cat.icon} color={cat.color} size={15} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, flex: 1 }}>{cat.name}</span>
                {cat.budget > 0 && <span style={{ fontSize: 11.5, color: C.slateSoft }} className="tabular">orçamento {fmt(cat.budget, "BRL")}</span>}
                <button onClick={() => deleteCategory(cat.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}><Trash2 size={14} /></button>
              </div>
              {isOpen && children.map(sub => (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px 8px 40px", borderBottom: `1px solid ${C.paperDim}`, background: C.paper }}>
                  <IconBadge name={sub.icon} color={sub.color} size={13} />
                  <span style={{ fontSize: 12.5, color: C.ink, flex: 1 }}>{sub.name}</span>
                  <button onClick={() => deleteCategory(sub.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ================= BUDGET ================= */
function BudgetView({ topCategories, categorySpent, pacePct }) {
  const withBudget = topCategories.filter(c => c.budget > 0);
  const alerts = withBudget.filter(c => categorySpent(c.id) / c.budget > 0.9);
  return (
    <div>
      {alerts.length > 0 && (
        <Card style={{ padding: 14, marginBottom: 14, background: C.coralSoft, border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.coral }}>
            <AlertTriangle size={16} />
            {alerts.length} categoria(s) perto ou acima do orçamento: {alerts.map(a => a.name).join(", ")}
          </div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
        {withBudget.map(cat => {
          const spent = categorySpent(cat.id);
          const pct = Math.min(100, (spent / cat.budget) * 100);
          const expectedPct = pacePct * 100;
          const tone = pct >= 100 ? C.coral : pct >= 70 ? C.amber : C.emerald;
          return (
            <Card key={cat.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <IconBadge name={cat.icon} color={cat.color} size={15} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, flex: 1 }}>{cat.name}</span>
                <span className="tabular" style={{ fontSize: 12, color: C.slate }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: C.paperDim, overflow: "hidden", position: "relative", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: tone, borderRadius: 99 }} />
                <div style={{ position: "absolute", left: `${Math.min(100, expectedPct)}%`, top: -2, width: 2, height: 12, background: C.ink, opacity: 0.4 }} title="ritmo esperado do mês" />
              </div>
              <div className="tabular" style={{ fontSize: 12.5, color: C.slate }}>{fmt(spent, "BRL")} de {fmt(cat.budget, "BRL")}</div>
            </Card>
          );
        })}
        {withBudget.length === 0 && <EmptyHint text="Defina orçamentos nas categorias para acompanhar aqui." />}
      </div>
    </div>
  );
}

/* ================= GOALS ================= */
function GoalsView({ goals, setShowGoalModal, deleteGoal }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button style={btnGhost} onClick={() => setShowGoalModal(true)}><Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Nova meta</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
        {goals.map(g => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <Card key={g.id} style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <IconBadge name="DollarSign" color={g.color} size={15} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{g.name}</span>
                </div>
                <button onClick={() => deleteGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateSoft }}><Trash2 size={14} /></button>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: C.paperDim, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: g.color, borderRadius: 99 }} />
              </div>
              <div className="tabular" style={{ fontSize: 12.5, color: C.slate }}>{fmt(g.current, "BRL")} de {fmt(g.target, "BRL")} ({pct.toFixed(0)}%)</div>
            </Card>
          );
        })}
        {goals.length === 0 && <EmptyHint text="Nenhuma meta criada ainda." />}
      </div>
    </div>
  );
}

/* ================= MODALS ================= */
function TxModal({ accounts, categories, editingTx, onClose, onSave }) {
  const [accountId, setAccountId] = useState(editingTx?.accountId || accounts[0]?.id || "");
  const [description, setDescription] = useState(editingTx?.description || "");
  const [amount, setAmount] = useState(editingTx ? Math.abs(editingTx.amount) : "");
  const [type, setType] = useState(editingTx?.type || "expense");
  const [date, setDate] = useState(editingTx?.date || todayISO());
  const [categoryId, setCategoryId] = useState(editingTx?.categoryId || categories.find(c => !c.parentId)?.id || "");
  const [paymentMethod, setPaymentMethod] = useState(editingTx?.paymentMethod || "debit");
  const [installments, setInstallments] = useState(1);

  const submit = () => {
    if (!description || !amount || !accountId) return;
    const val = parseFloat(amount);
    if (installments > 1 && paymentMethod === "credit") {
      const rows = [];
      for (let i = 0; i < installments; i++) {
        const d = new Date(date); d.setMonth(d.getMonth() + i);
        rows.push({
          id: uid(), accountId, date: d.toISOString().slice(0, 10),
          description: `${description} (${i + 1}/${installments})`,
          amount: -(val / installments), categoryId, type: "expense", paymentMethod,
        });
      }
      onSave({ __bulk: rows }); // handled below
      return;
    }
    onSave({ accountId, description, amount: type === "expense" ? -Math.abs(val) : Math.abs(val), categoryId: type === "transfer" ? null : categoryId, type, date, paymentMethod });
  };

  return (
    <Modal title={editingTx ? "Editar lançamento" : "Novo lançamento"} onClose={onClose}>
      <Field label="Descrição"><input style={inputStyle} value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Supermercado" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Valor"><input style={inputStyle} type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></Field>
        <Field label="Tipo">
          <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Conta">
          <select style={inputStyle} value={accountId} onChange={e => setAccountId(e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Forma de pagamento">
          <select style={inputStyle} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="debit">Débito</option>
            <option value="credit">Crédito</option>
          </select>
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Categoria">
          <select style={inputStyle} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.parentId ? "— " : ""}{c.name}</option>)}
          </select>
        </Field>
        <Field label="Data"><input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      </div>
      {paymentMethod === "credit" && type === "expense" && !editingTx && (
        <Field label="Parcelas">
          <input style={inputStyle} type="number" min="1" max="24" value={installments} onChange={e => setInstallments(parseInt(e.target.value) || 1)} />
        </Field>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={submit}>Salvar</button>
      </div>
    </Modal>
  );
}

function AccModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("BR");
  const [currency, setCurrency] = useState("BRL");
  const [initialBalance, setInitialBalance] = useState("");
  const [type, setType] = useState("checking");

  return (
    <Modal title="Nova conta" onClose={onClose}>
      <Field label="Nome"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Itaú" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="País">
          <select style={inputStyle} value={country} onChange={e => { setCountry(e.target.value); setCurrency(e.target.value === "BR" ? "BRL" : "USD"); }}>
            <option value="BR">Brasil</option><option value="US">Estados Unidos</option>
          </select>
        </Field>
        <Field label="Moeda">
          <select style={inputStyle} value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="BRL">BRL</option><option value="USD">USD</option><option value="EUR">EUR</option>
          </select>
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Tipo">
          <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
            <option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="credit">Cartão de crédito</option>
          </select>
        </Field>
        <Field label="Saldo inicial"><input style={inputStyle} type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} /></Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={() => name && onSave({ name, country, currency, type, initialBalance: parseFloat(initialBalance) || 0, closingDay: 20, dueDay: 5, limit: 5000 })}>Salvar</button>
      </div>
    </Modal>
  );
}

function CatModal({ categories, onClose, onSave }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(C.steel);
  const [icon, setIcon] = useState("Receipt");
  const [parentId, setParentId] = useState("");
  const [budget, setBudget] = useState("");
  const topCats = categories.filter(c => !c.parentId);

  return (
    <Modal title="Nova categoria" onClose={onClose}>
      <Field label="Nome"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Pets" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Cor"><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 9, padding: 2 }} /></Field>
        <Field label="Categoria pai (opcional)">
          <select style={inputStyle} value={parentId} onChange={e => setParentId(e.target.value)}>
            <option value="">Nenhuma (categoria principal)</option>
            {topCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Ícone">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 6 }}>
          {ICON_NAMES.map(n => {
            const Icon = ICONS[n];
            return (
              <button key={n} onClick={() => setIcon(n)} style={{
                border: icon === n ? `2px solid ${color}` : `1px solid ${C.line}`, borderRadius: 8, padding: 7,
                background: icon === n ? color + "18" : C.white, cursor: "pointer",
              }}><Icon size={15} color={C.ink} /></button>
            );
          })}
        </div>
      </Field>
      {!parentId && <Field label="Orçamento mensal (opcional)"><input style={inputStyle} type="number" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} placeholder="0.00" /></Field>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={() => name && onSave({ name, color, icon, parentId: parentId || null, budget: parseFloat(budget) || 0 })}>Salvar</button>
      </div>
    </Modal>
  );
}

function GoalModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [color, setColor] = useState(C.emerald);
  return (
    <Modal title="Nova meta" onClose={onClose}>
      <Field label="Nome"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Carro novo" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Valor alvo"><input style={inputStyle} type="number" step="0.01" value={target} onChange={e => setTarget(e.target.value)} /></Field>
        <Field label="Valor atual"><input style={inputStyle} type="number" step="0.01" value={current} onChange={e => setCurrent(e.target.value)} /></Field>
      </div>
      <Field label="Cor"><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 9, padding: 2 }} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={() => name && target && onSave({ name, target: parseFloat(target), current: parseFloat(current) || 0, color, deadline: "" })}>Salvar</button>
      </div>
    </Modal>
  );
}

function TransferModal({ accounts, exchangeRate, onClose, onSave }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [fromAmount, setFromAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const from = accounts.find(a => a.id === fromId);
  const to = accounts.find(a => a.id === toId);
  const rate = from && to && from.currency !== to.currency
    ? (from.currency === "USD" ? exchangeRate : 1 / exchangeRate) : 1;
  const toAmount = (parseFloat(fromAmount) || 0) * rate;

  return (
    <Modal title="Transferência entre contas" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="De">
          <select style={inputStyle} value={fromId} onChange={e => setFromId(e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
          </select>
        </Field>
        <Field label="Para">
          <select style={inputStyle} value={toId} onChange={e => setToId(e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
          </select>
        </Field>
      </div>
      <Field label={`Valor enviado (${from?.currency})`}><input style={inputStyle} type="number" step="0.01" value={fromAmount} onChange={e => setFromAmount(e.target.value)} /></Field>
      {from && to && from.currency !== to.currency && (
        <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 12 }}>
          Recebido em {to.currency}: <strong className="tabular">{fmt(toAmount, to.currency)}</strong> (câmbio {rate.toFixed(4)})
        </div>
      )}
      <Field label="Data"><input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} onClick={() => fromId && toId && fromAmount && onSave({ fromId, toId, fromAmount: parseFloat(fromAmount), toAmount, date })}>Transferir</button>
      </div>
    </Modal>
  );
}

function ImportModal({ accounts, categories, onClose, onImport }) {
  const [rawText, setRawText] = useState("");
  const [rows, setRows] = useState([]);
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [defaultCat, setDefaultCat] = useState(categories.find(c => !c.parentId)?.id || "");
  const fileRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    const delim = lines[0].includes(";") ? ";" : ",";
    const header = lines[0].toLowerCase();
    const startIdx = /data|date|descri|amount|valor/.test(header) ? 1 : 0;
    const parsed = [];
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split(delim).map(c => c.trim().replace(/^"|"$/g, ""));
      if (cols.length < 2) continue;
      let [c0, c1, c2] = cols;
      let date = c0, description = c1, amountStr = c2;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const m = date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (m) date = `${m[3]}-${m[2]}-${m[1]}`;
        else date = todayISO();
      }
      const amount = parseFloat((amountStr || "0").replace(/\./g, "").replace(",", "."));
      if (isNaN(amount)) continue;
      parsed.push({ date, description: description || "Importado", amount });
    }
    return parsed;
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setRawText(ev.target.result); setRows(parseCSV(ev.target.result)); };
    reader.readAsText(file);
  };

  const confirm = () => {
    const finalRows = rows.map(r => ({
      id: uid(), accountId, date: r.date, description: r.description,
      amount: r.amount, categoryId: defaultCat, type: r.amount < 0 ? "expense" : "income", paymentMethod: "debit",
    }));
    onImport(finalRows);
  };

  return (
    <Modal title="Importar extrato / fatura (CSV)" width={560} onClose={onClose}>
      <div style={{ fontSize: 12.5, color: C.slateSoft, marginBottom: 12 }}>
        Formato esperado por linha: <code>data, descrição, valor</code> (valores negativos = despesa). Exporte o CSV do seu banco e envie aqui.
      </div>
      <Field label="Arquivo CSV">
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={inputStyle} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Lançar na conta">
          <select style={inputStyle} value={accountId} onChange={e => setAccountId(e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Categoria padrão">
          <select style={inputStyle} value={defaultCat} onChange={e => setDefaultCat(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.parentId ? "— " : ""}{c.name}</option>)}
          </select>
        </Field>
      </div>
      {rows.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${C.line}`, borderRadius: 9, marginTop: 6 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 10px", borderBottom: `1px solid ${C.paperDim}` }}>
              <span>{r.date} · {r.description}</span>
              <span className="tabular" style={{ color: r.amount < 0 ? C.coral : C.emerald }}>{r.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: C.slateSoft, marginTop: 8 }}>{rows.length} lançamento(s) detectado(s). Para faturas em PDF, exporte como CSV/OFX pelo app do banco antes de importar.</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button style={btnGhost} onClick={onClose}>Cancelar</button>
        <button style={btnPrimary} disabled={rows.length === 0} onClick={confirm}>Importar {rows.length} lançamentos</button>
      </div>
    </Modal>
  );
}
