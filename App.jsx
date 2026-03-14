import { useState, useEffect, useCallback } from "react";

// ─── Storage ────────────────────────────────────────────────
const STORAGE_KEY = "budgetflow-data";
const ONBOARDING_KEY = "budgetflow-onboarded";

const emptyData = () => ({
  userName: "",
  incomes: [],
  expenses: [],
  goals: [],
  splitRule: { mode: "fixed", epargneFixed: 0, investissementFixed: 0, epargne: 50, investissement: 30, loisirs: 10, projets: 10 },
  history: [],
});

const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Nutsy Mascot (inspired by kawaii squirrel with coin & money bag) ────
const Nutsy = ({ size = 48, message, mood = "happy" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
      {/* Shadow */}
      <ellipse cx="50" cy="95" rx="26" ry="4" fill="#00000012" />
      {/* Tail */}
      <path d="M72 58 Q96 28 86 10 Q80 0 74 8 Q67 18 72 32 Q77 44 68 55" fill="#D4621A" />
      <path d="M74 55 Q93 32 84 15 Q80 8 76 14 Q71 22 75 34 Q79 44 70 53" fill="#E87A2E" />
      {/* Money bag on back */}
      <ellipse cx="28" cy="45" rx="9" ry="11" fill="#8B6914" />
      <ellipse cx="28" cy="38" rx="6" ry="3.5" fill="#A07828" />
      <rect x="25" y="30" width="6" height="5" rx="1.5" fill="#6B5210" />
      <rect x="22" y="25" width="10" height="6" rx="1" fill="#4CAF50" transform="rotate(-8 27 28)" />
      <rect x="24" y="23" width="8" height="5" rx="1" fill="#66BB6A" transform="rotate(6 28 25)" />
      <rect x="26" y="22" width="6" height="4" rx="1" fill="#81C784" transform="rotate(-4 29 23)" />
      {/* Body */}
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#E8731E" />
      <ellipse cx="50" cy="74" rx="14" ry="16" fill="#FBE5C8" />
      {/* Head */}
      <circle cx="50" cy="38" r="20" fill="#E8731E" />
      {/* Ears */}
      <ellipse cx="34" cy="21" rx="6" ry="9" fill="#E8731E" />
      <ellipse cx="66" cy="21" rx="6" ry="9" fill="#E8731E" />
      <ellipse cx="34" cy="21" rx="4" ry="6" fill="#F5B078" />
      <ellipse cx="66" cy="21" rx="4" ry="6" fill="#F5B078" />
      {/* Face fur patch */}
      <ellipse cx="50" cy="40" rx="16" ry="15" fill="#F0923A" />
      {/* Eyes */}
      <ellipse cx="43" cy="35" rx="5" ry="5.5" fill="white" />
      <ellipse cx="57" cy="35" rx="5" ry="5.5" fill="white" />
      <ellipse cx={mood === "happy" ? "44.2" : "43"} cy="35.5" rx="3.2" ry="3.8" fill="#3E2412" />
      <ellipse cx={mood === "happy" ? "58.2" : "57"} cy="35.5" rx="3.2" ry="3.8" fill="#3E2412" />
      <circle cx="45" cy="33.5" r="1.3" fill="white" />
      <circle cx="59" cy="33.5" r="1.3" fill="white" />
      {/* Rosy cheeks */}
      <ellipse cx="35" cy="43" rx="4.5" ry="3" fill="#F5A0A0" opacity="0.5" />
      <ellipse cx="65" cy="43" rx="4.5" ry="3" fill="#F5A0A0" opacity="0.5" />
      {/* Nose */}
      <ellipse cx="50" cy="42" rx="2.8" ry="2.2" fill="#C0392B" />
      <ellipse cx="49.5" cy="41.3" rx="1.2" ry="0.8" fill="#E57373" opacity="0.5" />
      {/* Mouth */}
      {mood === "happy" ? (
        <path d="M45 46 Q50 52 55 46" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M46 48 Q50 45 54 48" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {/* Left arm (holding bag) */}
      <ellipse cx="34" cy="64" rx="4.5" ry="7" fill="#E8731E" transform="rotate(15 34 64)" />
      {/* Right arm (holding coin) */}
      <ellipse cx="65" cy="61" rx="4.5" ry="7" fill="#E8731E" transform="rotate(-20 65 61)" />
      {/* Gold coin */}
      <circle cx="73" cy="57" r="8.5" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
      <circle cx="73" cy="57" r="6.5" fill="none" stroke="#DAA520" strokeWidth="0.5" />
      <text x="73" y="61" textAnchor="middle" fontSize="11" fill="#8B6914" fontWeight="bold" fontFamily="serif">€</text>
      {/* Feet */}
      <ellipse cx="42" cy="90" rx="7" ry="3.5" fill="#D4621A" />
      <ellipse cx="58" cy="90" rx="7" ry="3.5" fill="#D4621A" />
    </svg>
    {message && (
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
        border: "1px solid #bbf7d0", borderRadius: 14,
        padding: "10px 16px", fontSize: 13.5, color: "#166534",
        maxWidth: 260, lineHeight: 1.55, position: "relative",
      }}>
        <div style={{
          position: "absolute", left: -6, top: 12,
          width: 0, height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderRight: "6px solid #bbf7d0",
        }} />
        {message}
      </div>
    )}
  </div>
);

const NutsyBig = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Shadow */}
    <ellipse cx="50" cy="95" rx="28" ry="4.5" fill="#00000015" />
    {/* Tail */}
    <path d="M72 58 Q96 28 86 10 Q80 0 74 8 Q67 18 72 32 Q77 44 68 55" fill="#D4621A" />
    <path d="M74 55 Q93 32 84 15 Q80 8 76 14 Q71 22 75 34 Q79 44 70 53" fill="#E87A2E" />
    {/* Money bag */}
    <ellipse cx="28" cy="45" rx="9" ry="11" fill="#8B6914" />
    <ellipse cx="28" cy="38" rx="6" ry="3.5" fill="#A07828" />
    <rect x="25" y="30" width="6" height="5" rx="1.5" fill="#6B5210" />
    <rect x="22" y="25" width="10" height="6" rx="1" fill="#4CAF50" transform="rotate(-8 27 28)" />
    <rect x="24" y="23" width="8" height="5" rx="1" fill="#66BB6A" transform="rotate(6 28 25)" />
    <rect x="26" y="22" width="6" height="4" rx="1" fill="#81C784" transform="rotate(-4 29 23)" />
    {/* Body */}
    <ellipse cx="50" cy="70" rx="20" ry="22" fill="#E8731E" />
    <ellipse cx="50" cy="74" rx="14" ry="16" fill="#FBE5C8" />
    {/* Head */}
    <circle cx="50" cy="38" r="20" fill="#E8731E" />
    {/* Ears */}
    <ellipse cx="34" cy="21" rx="6" ry="9" fill="#E8731E" />
    <ellipse cx="66" cy="21" rx="6" ry="9" fill="#E8731E" />
    <ellipse cx="34" cy="21" rx="4" ry="6" fill="#F5B078" />
    <ellipse cx="66" cy="21" rx="4" ry="6" fill="#F5B078" />
    {/* Face */}
    <ellipse cx="50" cy="40" rx="16" ry="15" fill="#F0923A" />
    {/* Eyes */}
    <ellipse cx="43" cy="35" rx="5.5" ry="6" fill="white" />
    <ellipse cx="57" cy="35" rx="5.5" ry="6" fill="white" />
    <ellipse cx="44.5" cy="35.5" rx="3.5" ry="4.2" fill="#3E2412" />
    <ellipse cx="58.5" cy="35.5" rx="3.5" ry="4.2" fill="#3E2412" />
    <circle cx="45.5" cy="33" r="1.5" fill="white" />
    <circle cx="59.5" cy="33" r="1.5" fill="white" />
    <circle cx="44" cy="36" r="0.7" fill="white" />
    <circle cx="58" cy="36" r="0.7" fill="white" />
    {/* Rosy cheeks */}
    <ellipse cx="35" cy="43" rx="5" ry="3.5" fill="#F5A0A0" opacity="0.5" />
    <ellipse cx="65" cy="43" rx="5" ry="3.5" fill="#F5A0A0" opacity="0.5" />
    {/* Nose */}
    <ellipse cx="50" cy="42" rx="3" ry="2.5" fill="#C0392B" />
    <ellipse cx="49.5" cy="41.2" rx="1.5" ry="1" fill="#E57373" opacity="0.5" />
    {/* Happy mouth */}
    <path d="M44 46 Q50 53 56 46" stroke="#8B4513" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    {/* Arms */}
    <ellipse cx="34" cy="64" rx="4.5" ry="7" fill="#E8731E" transform="rotate(15 34 64)" />
    <ellipse cx="65" cy="61" rx="4.5" ry="7" fill="#E8731E" transform="rotate(-20 65 61)" />
    {/* Coin */}
    <circle cx="73" cy="57" r="9" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
    <circle cx="73" cy="57" r="7" fill="none" stroke="#DAA520" strokeWidth="0.5" />
    <text x="73" y="61" textAnchor="middle" fontSize="12" fill="#8B6914" fontWeight="bold" fontFamily="serif">€</text>
    {/* Feet */}
    <ellipse cx="42" cy="90" rx="7" ry="3.5" fill="#D4621A" />
    <ellipse cx="58" cy="90" rx="7" ry="3.5" fill="#D4621A" />
  </svg>
);

// ─── Charts ─────────────────────────────────────────────────
const DonutChart = ({ segments, size = 160, thickness = 28, centerLabel, centerValue }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const cur = offset; offset += dash;
        return <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={seg.color} strokeWidth={thickness}
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-cur} strokeLinecap="round"
          style={{ transition: "all 0.8s ease" }} />;
      })}
      {centerLabel && <>
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="'DM Sans', sans-serif">{centerLabel}</text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="20" fill="#0f172a" fontWeight="700" fontFamily="'Sora', sans-serif">{centerValue}</text>
      </>}
    </svg>
  );
};

const BarChart = ({ data, maxVal }) => {
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{d.value > 0 ? `${d.value.toFixed(0)}€` : ""}</span>
          <div style={{ width: "100%", maxWidth: 32, height: `${Math.max((d.value / max) * 90, 4)}px`,
            background: d.color || "linear-gradient(180deg, #10b981, #059669)", borderRadius: "6px 6px 2px 2px", transition: "height 0.6s ease" }} />
          <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 500 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ pct, color = "#10b981", height = 10 }) => (
  <div style={{ width: "100%", height, background: "#f1f5f9", borderRadius: height, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: height, transition: "width 0.8s ease" }} />
  </div>
);

// ─── Constants ──────────────────────────────────────────────
const expenseCategoryColors = { "Logement": "#6366f1", "Vie quotidienne": "#f59e0b", "Abonnements": "#8b5cf6", "Personnel": "#ec4899", "Autres": "#94a3b8" };
const expenseCategoryIcons = { "Logement": "🏠", "Vie quotidienne": "🛒", "Abonnements": "📱", "Personnel": "💃", "Autres": "📦" };
const incomeCategoryColors = { "Salaire": "#10b981", "Freelance": "#3b82f6", "Prime": "#f59e0b", "Revenus passifs": "#8b5cf6", "Investissements": "#06b6d4", "Autres": "#94a3b8" };
const INCOME_CATEGORIES = ["Salaire", "Freelance", "Prime", "Revenus passifs", "Investissements", "Autres"];
const INCOME_FREQUENCIES = ["Mensuel", "Hebdomadaire", "Ponctuel"];
const EXPENSE_CATEGORIES = ["Logement", "Vie quotidienne", "Abonnements", "Personnel", "Autres"];
const EXPENSE_FREQUENCIES = ["Mensuelle", "Ponctuelle"];
const EXPENSE_SUBS = {
  "Logement": ["loyer", "crédit immobilier"],
  "Vie quotidienne": ["alimentation", "transport", "carburant", "factures"],
  "Abonnements": ["Netflix", "Spotify", "téléphone", "internet"],
  "Personnel": ["shopping", "sport", "sorties"],
  "Autres": ["imprévus", "santé", "éducation"],
};
const fmt = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// ─── Styled ─────────────────────────────────────────────────
const inputStyle = { width: "100%", padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
const selectStyle = { ...inputStyle, appearance: "none", background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%2394a3b8' stroke-width='2'/%3E%3C/svg%3E\") right 12px center no-repeat" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" };
const btnPrimary = { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%", letterSpacing: 0.3 };
const btnSecondary = { background: "transparent", color: "#64748b", border: "2px solid #e2e8f0", borderRadius: 14, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" };

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, maxHeight: "85vh", overflow: "auto", padding: "28px 24px 32px", animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 12, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#64748b", display: "grid", placeItems: "center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Card = ({ children, style: s = {}, delay = 0 }) => (
  <div style={{
    background: "#fff", borderRadius: 20, padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
    animation: `cardIn 0.5s ease ${delay}ms both`, ...s,
  }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════════
const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [splitRule, setSplitRule] = useState({ mode: "fixed", epargneFixed: 0, investissementFixed: 0, epargne: 50, investissement: 30, loisirs: 10, projets: 10 });
  const [tempIncome, setTempIncome] = useState({ name: "", amount: "", frequency: "Mensuel", category: "Salaire" });
  const [tempExpense, setTempExpense] = useState({ name: "", amount: "", frequency: "Mensuelle", category: "Vie quotidienne", sub: "alimentation", comment: "" });
  const [tempGoal, setTempGoal] = useState({ name: "", target: "", saved: "", icon: "🎯" });

  const totalSteps = 7;
  const goNext = () => { setVisible(false); setTimeout(() => { setStep(s => s + 1); setVisible(true); }, 200); };
  const goBack = () => { setVisible(false); setTimeout(() => { setStep(s => s - 1); setVisible(true); }, 200); };

  const addIncome = () => {
    if (!tempIncome.name || !tempIncome.amount) return;
    setIncomes(p => [...p, { ...tempIncome, id: uid(), amount: parseFloat(tempIncome.amount) }]);
    setTempIncome({ name: "", amount: "", frequency: "Mensuel", category: "Salaire" });
  };
  const addExpense = () => {
    if (!tempExpense.name || !tempExpense.amount) return;
    setExpenses(p => [...p, { ...tempExpense, id: uid(), amount: parseFloat(tempExpense.amount) }]);
    setTempExpense({ name: "", amount: "", frequency: "Mensuelle", category: "Vie quotidienne", sub: "alimentation", comment: "" });
  };
  const addGoal = () => {
    if (!tempGoal.name || !tempGoal.target) return;
    setGoals(p => [...p, { ...tempGoal, id: uid(), target: parseFloat(tempGoal.target), saved: parseFloat(tempGoal.saved || 0) }]);
    setTempGoal({ name: "", target: "", saved: "", icon: "🎯" });
  };

  const totalInc = incomes.reduce((s, i) => s + (i.frequency === "Hebdomadaire" ? i.amount * 4 : i.amount), 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalInc - totalExp;

  const quickExpenses = [
    { name: "Loyer", amount: 800, category: "Logement", sub: "loyer", icon: "🏠" },
    { name: "Courses", amount: 350, category: "Vie quotidienne", sub: "alimentation", icon: "🛒" },
    { name: "Transport", amount: 75, category: "Vie quotidienne", sub: "transport", icon: "🚌" },
    { name: "Énergie", amount: 100, category: "Vie quotidienne", sub: "factures", icon: "⚡" },
    { name: "Netflix", amount: 15.49, category: "Abonnements", sub: "Netflix", icon: "🎬" },
    { name: "Spotify", amount: 10.99, category: "Abonnements", sub: "Spotify", icon: "🎵" },
    { name: "Téléphone", amount: 20, category: "Abonnements", sub: "téléphone", icon: "📱" },
    { name: "Internet", amount: 30, category: "Abonnements", sub: "internet", icon: "🌐" },
    { name: "Sport", amount: 35, category: "Personnel", sub: "sport", icon: "💪" },
    { name: "Shopping", amount: 80, category: "Personnel", sub: "shopping", icon: "🛍️" },
  ];
  const quickGoals = [
    { name: "Fonds d'urgence", target: 5000, icon: "🛡️" },
    { name: "Voyage", target: 3000, icon: "✈️" },
    { name: "Nouvelle voiture", target: 15000, icon: "🚗" },
    { name: "Achat immobilier", target: 30000, icon: "🏠" },
    { name: "Éducation", target: 5000, icon: "📚" },
    { name: "Mariage", target: 10000, icon: "💍" },
  ];

  const quickAddExpense = (qe) => {
    if (expenses.find(e => e.name === qe.name)) return;
    setExpenses(p => [...p, { id: uid(), name: qe.name, amount: qe.amount, frequency: "Mensuelle", category: qe.category, sub: qe.sub, comment: "" }]);
  };
  const quickAddGoal = (qg) => {
    if (goals.find(g => g.name === qg.name)) return;
    setGoals(p => [...p, { id: uid(), name: qg.name, target: qg.target, saved: 0, icon: qg.icon }]);
  };

  const progressPct = ((step + 1) / totalSteps) * 100;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(180deg, #f8fafc 0%, #f0fdf4 40%, #ecfdf5 100%)", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {step > 0 && (
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#64748b", padding: 0 }}>←</button>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Étape {step + 1} / {totalSteps}</span>
            <div style={{ width: 24 }} />
          </div>
          <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: 4, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, padding: "24px 20px 32px", overflowY: "auto", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-16px)", transition: "all 0.2s ease" }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", textAlign: "center", gap: 24 }}>
            <div style={{ animation: "bounceIn 0.8s ease" }}><NutsyBig size={130} /></div>
            <div>
              <h1 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 800, fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg, #059669, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BudgetFlow</h1>
              <p style={{ margin: 0, fontSize: 16, color: "#475569", lineHeight: 1.6 }}>Ton pilote financier personnel</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", border: "1px solid #bbf7d0", borderRadius: 20, padding: "18px 22px", maxWidth: 320, textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: 14, color: "#166534", lineHeight: 1.6 }}>
                Salut ! Moi c'est <strong>Nutsy</strong> 🐿️ — je vais t'aider à configurer ton budget en quelques minutes. Prêt·e ?
              </p>
            </div>
            <button onClick={goNext} style={{ ...btnPrimary, maxWidth: 280, padding: "16px 32px", fontSize: 16, borderRadius: 18 }}>C'est parti ! 🚀</button>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Configuration en ~3 minutes</p>
          </div>
        )}

        {/* STEP 1: Prénom */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Nutsy size={48} message="Commençons ! Comment tu t'appelles ?" />
            <div style={{ marginTop: 8 }}>
              <label style={{ ...labelStyle, fontSize: 14, marginBottom: 8 }}>Ton prénom</label>
              <input style={{ ...inputStyle, fontSize: 18, padding: "16px 18px", borderRadius: 16 }} value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ex: Sarah" autoFocus />
            </div>
            {userName && (
              <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "16px 20px", textAlign: "center" }}>
                <span style={{ fontSize: 24 }}>👋</span>
                <p style={{ margin: "8px 0 0", fontSize: 15, color: "#166534", fontWeight: 600 }}>Enchanté {userName} ! On va construire ton budget ensemble.</p>
              </div>
            )}
            <button onClick={goNext} style={{ ...btnPrimary, opacity: userName ? 1 : 0.4, marginTop: 8 }} disabled={!userName}>Continuer →</button>
          </div>
        )}

        {/* STEP 2: Revenus */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Nutsy size={44} message={`${userName}, d'où vient ton argent ? Ajoute tes sources de revenus 💰`} />
            {incomes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {incomes.map(inc => (
                  <div key={inc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf4", borderRadius: 14, padding: "12px 16px", border: "1px solid #bbf7d0" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{inc.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        <span style={{ background: `${incomeCategoryColors[inc.category]}20`, color: incomeCategoryColors[inc.category], padding: "1px 6px", borderRadius: 4, fontWeight: 600, fontSize: 10 }}>{inc.category}</span>
                        <span style={{ marginLeft: 6 }}>{inc.frequency}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#059669", fontFamily: "'Sora', sans-serif" }}>+{fmt(inc.amount)}€</span>
                      <button onClick={() => setIncomes(p => p.filter(i => i.id !== inc.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ef4444", padding: 2 }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "center", padding: "8px 0", fontSize: 14, fontWeight: 700, color: "#059669", fontFamily: "'Sora', sans-serif" }}>Total : {fmt(totalInc)}€ / mois</div>
              </div>
            )}
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#334155" }}>Ajouter un revenu</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}><input style={inputStyle} placeholder="Nom" value={tempIncome.name} onChange={e => setTempIncome(p => ({ ...p, name: e.target.value }))} /></div>
                  <div style={{ width: 110 }}><input style={inputStyle} type="number" placeholder="€" value={tempIncome.amount} onChange={e => setTempIncome(p => ({ ...p, amount: e.target.value }))} /></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select style={{ ...selectStyle, flex: 1 }} value={tempIncome.category} onChange={e => setTempIncome(p => ({ ...p, category: e.target.value }))}>{INCOME_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                  <select style={{ ...selectStyle, flex: 1 }} value={tempIncome.frequency} onChange={e => setTempIncome(p => ({ ...p, frequency: e.target.value }))}>{INCOME_FREQUENCIES.map(f => <option key={f}>{f}</option>)}</select>
                </div>
                <button onClick={addIncome} style={{ ...btnPrimary, padding: "11px 20px", fontSize: 13, opacity: (tempIncome.name && tempIncome.amount) ? 1 : 0.4 }} disabled={!tempIncome.name || !tempIncome.amount}>+ Ajouter ce revenu</button>
              </div>
            </div>
            <button onClick={goNext} style={{ ...btnPrimary, opacity: incomes.length > 0 ? 1 : 0.4, marginTop: 4 }} disabled={incomes.length === 0}>Continuer →</button>
            {incomes.length === 0 && <p style={{ fontSize: 12, color: "#f59e0b", textAlign: "center", margin: 0 }}>Ajoute au moins un revenu pour continuer</p>}
          </div>
        )}

        {/* STEP 3: Dépenses */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Nutsy size={44} message="Maintenant, tes dépenses mensuelles ! Utilise les raccourcis 🛒" />
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Ajouter rapidement</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {quickExpenses.map(qe => {
                  const added = expenses.find(e => e.name === qe.name);
                  return (
                    <button key={qe.name} onClick={() => quickAddExpense(qe)} style={{
                      background: added ? "#dcfce7" : "#fff", border: added ? "1.5px solid #86efac" : "1.5px solid #e2e8f0",
                      borderRadius: 12, padding: "8px 12px", fontSize: 12, cursor: added ? "default" : "pointer",
                      display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif",
                      color: added ? "#166534" : "#334155", fontWeight: 600, opacity: added ? 0.7 : 1,
                    }}>
                      <span>{qe.icon}</span> {qe.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>{qe.amount}€</span>
                      {added && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {expenses.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Tes dépenses ({expenses.length})</p>
                {expenses.map(exp => (
                  <div key={exp.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 12, padding: "10px 14px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{expenseCategoryIcons[exp.category] || "📦"}</span>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{exp.name}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{exp.category}</div></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>-{fmt(exp.amount)}€</span>
                      <button onClick={() => setExpenses(p => p.filter(e => e.id !== exp.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#cbd5e1", padding: 2 }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", fontSize: 14, fontWeight: 700 }}>
                  <span style={{ color: "#64748b" }}>Total :</span><span style={{ color: "#ef4444", fontFamily: "'Sora', sans-serif" }}>{fmt(totalExp)}€</span>
                </div>
              </div>
            )}
            <details style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <summary style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer" }}>✏️ Ajouter manuellement</summary>
              <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Nom" value={tempExpense.name} onChange={e => setTempExpense(p => ({ ...p, name: e.target.value }))} />
                  <input style={{ ...inputStyle, width: 100 }} type="number" placeholder="€" value={tempExpense.amount} onChange={e => setTempExpense(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select style={{ ...selectStyle, flex: 1 }} value={tempExpense.category} onChange={e => setTempExpense(p => ({ ...p, category: e.target.value, sub: EXPENSE_SUBS[e.target.value]?.[0] || "" }))}>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                  {EXPENSE_SUBS[tempExpense.category] && <select style={{ ...selectStyle, flex: 1 }} value={tempExpense.sub} onChange={e => setTempExpense(p => ({ ...p, sub: e.target.value }))}>{EXPENSE_SUBS[tempExpense.category].map(s => <option key={s}>{s}</option>)}</select>}
                </div>
                <button onClick={addExpense} style={{ ...btnPrimary, padding: "10px", fontSize: 13, opacity: (tempExpense.name && tempExpense.amount) ? 1 : 0.4 }} disabled={!tempExpense.name || !tempExpense.amount}>+ Ajouter</button>
              </div>
            </details>
            {expenses.length > 0 && (
              <div style={{ background: remaining >= 0 ? "linear-gradient(135deg, #ecfdf5, #f0fdf4)" : "linear-gradient(135deg, #fef2f2, #fff1f2)", border: `1px solid ${remaining >= 0 ? "#bbf7d0" : "#fecaca"}`, borderRadius: 16, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Il te reste</div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: remaining >= 0 ? "#059669" : "#ef4444" }}>{fmt(remaining)}€</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>par mois</div>
              </div>
            )}
            <button onClick={goNext} style={{ ...btnPrimary, marginTop: 4 }}>Continuer →</button>
          </div>
        )}

        {/* STEP 4: Objectifs */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Nutsy size={44} message="Tu as des rêves ou des projets ? Définis tes objectifs ! ✨" />
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Objectifs populaires</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {quickGoals.map(qg => {
                  const added = goals.find(g => g.name === qg.name);
                  return (
                    <button key={qg.name} onClick={() => quickAddGoal(qg)} style={{
                      background: added ? "#ede9fe" : "#fff", border: added ? "1.5px solid #c4b5fd" : "1.5px solid #e2e8f0",
                      borderRadius: 12, padding: "8px 14px", fontSize: 12, cursor: added ? "default" : "pointer",
                      display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif",
                      color: added ? "#5b21b6" : "#334155", fontWeight: 600,
                    }}><span>{qg.icon}</span> {qg.name}{added && <span> ✓</span>}</button>
                  );
                })}
              </div>
            </div>
            {goals.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {goals.map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 16px", border: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 24 }}>{g.icon}</span>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{g.name}</div><div style={{ fontSize: 12, color: "#64748b" }}>Objectif : {fmt(g.target)}€</div></div>
                    <button onClick={() => setGoals(p => p.filter(x => x.id !== g.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#cbd5e1" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <details style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <summary style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer" }}>✏️ Créer un objectif personnalisé</summary>
              <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                <input style={inputStyle} placeholder="Nom de l'objectif" value={tempGoal.name} onChange={e => setTempGoal(p => ({ ...p, name: e.target.value }))} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {["🎯", "🛡️", "✈️", "🚗", "🏠", "💰", "📚", "💍", "🏖️", "💻"].map(ic => (
                    <button key={ic} onClick={() => setTempGoal(p => ({ ...p, icon: ic }))} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center", border: ic === tempGoal.icon ? "2px solid #8b5cf6" : "2px solid #e2e8f0", background: ic === tempGoal.icon ? "#ede9fe" : "#fff" }}>{ic}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Montant cible €" value={tempGoal.target} onChange={e => setTempGoal(p => ({ ...p, target: e.target.value }))} />
                  <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Déjà économisé €" value={tempGoal.saved} onChange={e => setTempGoal(p => ({ ...p, saved: e.target.value }))} />
                </div>
                <button onClick={addGoal} style={{ ...btnPrimary, padding: "10px", fontSize: 13, opacity: (tempGoal.name && tempGoal.target) ? 1 : 0.4 }} disabled={!tempGoal.name || !tempGoal.target}>+ Créer</button>
              </div>
            </details>
            <button onClick={goNext} style={{ ...btnPrimary, marginTop: 4 }}>Continuer →</button>
            <button onClick={goNext} style={{ ...btnSecondary, fontSize: 13 }}>Passer cette étape</button>
          </div>
        )}

        {/* STEP 5: Combien mettre de côté ? */}
        {step === 5 && (() => {
          const obEpFixed = splitRule.epargneFixed || 0;
          const obInvFixed = splitRule.investissementFixed || 0;
          const obDispo = Math.max(0, remaining - obEpFixed - obInvFixed);
          return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Nutsy size={44} message="Combien veux-tu mettre de côté chaque mois ? Tu pourras toujours changer après ! 🧠" />
            {remaining > 0 && (
              <div style={{ background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)", borderRadius: 16, padding: 16, textAlign: "center", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Argent disponible après dépenses</div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#059669" }}>{fmt(remaining)}€</div>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #f1f5f9" }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "block", marginBottom: 6 }}>🏦 Combien épargner par mois ?</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input style={{ ...inputStyle, flex: 1, fontSize: 18, textAlign: "center" }} type="number" value={splitRule.epargneFixed} onChange={e => setSplitRule(p => ({ ...p, epargneFixed: parseInt(e.target.value) || 0 }))} placeholder="0" />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#10b981" }}>€</span>
                </div>
                <input type="range" min={0} max={Math.max(remaining, 0)} step={10} value={Math.min(splitRule.epargneFixed || 0, remaining)} onChange={e => setSplitRule(p => ({ ...p, epargneFixed: parseInt(e.target.value) }))} style={{ width: "100%", accentColor: "#10b981", marginTop: 8 }} />
                <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, textAlign: "right" }}>{remaining > 0 ? Math.round((Math.min(obEpFixed, remaining) / remaining) * 100) : 0}% de ton reste</div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "block", marginBottom: 6 }}>📈 Combien investir par mois ?</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input style={{ ...inputStyle, flex: 1, fontSize: 18, textAlign: "center" }} type="number" value={splitRule.investissementFixed} onChange={e => setSplitRule(p => ({ ...p, investissementFixed: parseInt(e.target.value) || 0 }))} placeholder="0" />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#3b82f6" }}>€</span>
                </div>
                <input type="range" min={0} max={Math.max(remaining - obEpFixed, 0)} step={10} value={Math.min(splitRule.investissementFixed || 0, remaining - obEpFixed)} onChange={e => setSplitRule(p => ({ ...p, investissementFixed: parseInt(e.target.value) }))} style={{ width: "100%", accentColor: "#3b82f6", marginTop: 8 }} />
              </div>

              {/* What's left */}
              <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", borderRadius: 14, padding: "14px 16px", border: "1px solid #fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>🎉 Reste pour tes loisirs</div>
                  <div style={{ fontSize: 11, color: "#a16207" }}>Dépenses libres, sorties, projets</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: obDispo > 0 ? "#d97706" : "#ef4444", fontFamily: "'Sora', sans-serif" }}>{fmt(obDispo)}€</div>
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Suggestions rapides</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "Prudent", ep: Math.round(remaining * 0.4), inv: Math.round(remaining * 0.2) },
                  { label: "Équilibré", ep: Math.round(remaining * 0.25), inv: Math.round(remaining * 0.15) },
                  { label: "Max loisirs", ep: Math.round(remaining * 0.15), inv: Math.round(remaining * 0.05) },
                ].map(p => (
                  <button key={p.label} onClick={() => setSplitRule(prev => ({ ...prev, epargneFixed: p.ep, investissementFixed: p.inv }))} style={{ flex: 1, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "8px 6px", fontSize: 11, fontWeight: 700, color: "#475569", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{p.label}</button>
                ))}
              </div>
            </div>

            <button onClick={goNext} style={btnPrimary}>Continuer →</button>
          </div>
          );
        })()}

        {/* STEP 6: Récapitulatif */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <NutsyBig size={90} />
              <h2 style={{ margin: "12px 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#0f172a" }}>Tout est prêt, {userName} !</h2>
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Voici le résumé de ton budget</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Revenus", value: `${fmt(totalInc)}€`, bg: "#ecfdf5", color: "#059669", border: "#bbf7d0" },
                { label: "Dépenses", value: `${fmt(totalExp)}€`, bg: "#fef2f2", color: "#ef4444", border: "#fecaca" },
                { label: "Reste", value: `${fmt(remaining)}€`, bg: remaining >= 0 ? "#f0fdf4" : "#fef2f2", color: remaining >= 0 ? "#059669" : "#ef4444", border: remaining >= 0 ? "#86efac" : "#fca5a5" },
              ].map((c, i) => (
                <div key={i} style={{ background: c.bg, borderRadius: 16, padding: "14px 10px", textAlign: "center", border: `1px solid ${c.border}` }}>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{c.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: c.color, fontFamily: "'Sora', sans-serif", marginTop: 4 }}>{c.value}</div>
                </div>
              ))}
            </div>
            {remaining > 0 && (
              <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <DonutChart size={140} thickness={24} centerLabel="Reste" centerValue={`${fmt(remaining)}€`}
                  segments={remaining > 0 ? [
                    { pct: (Math.min(splitRule.epargneFixed || 0, remaining) / remaining) * 100, color: "#10b981" },
                    { pct: (Math.min(splitRule.investissementFixed || 0, remaining) / remaining) * 100, color: "#3b82f6" },
                    { pct: Math.max(0, (remaining - (splitRule.epargneFixed || 0) - (splitRule.investissementFixed || 0)) / remaining) * 100, color: "#f59e0b" },
                  ] : []} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14, justifyContent: "center" }}>
                  {[{ label: "Épargne", val: Math.min(splitRule.epargneFixed || 0, remaining), color: "#10b981" }, { label: "Invest.", val: Math.min(splitRule.investissementFixed || 0, remaining), color: "#3b82f6" }, { label: "Loisirs", val: Math.max(0, remaining - (splitRule.epargneFixed || 0) - (splitRule.investissementFixed || 0)), color: "#f59e0b" }].map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} /><span style={{ color: "#475569" }}>{s.label}</span>
                      <span style={{ fontWeight: 700, color: s.color }}>{fmt(s.val)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>📊 Détails</div>
              {[["Sources de revenus", incomes.length], ["Postes de dépenses", expenses.length], ["Objectifs financiers", goals.length], ["Épargne/mois", `${fmt(splitRule.epargneFixed || 0)}€`], ["Investissement/mois", `${fmt(splitRule.investissementFixed || 0)}€`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", padding: "4px 0" }}>
                  <span>{l}</span><span style={{ fontWeight: 700, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onComplete({ userName, incomes, expenses, goals, splitRule: { ...splitRule, mode: "fixed" }, history: [] })} style={{
              ...btnPrimary, padding: "18px 32px", fontSize: 17, borderRadius: 20,
              background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
              boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
            }}>Lancer BudgetFlow ! 🚀</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function BudgetFlowApp() {
  const [data, setData] = useState(null);
  const [onboarded, setOnboarded] = useState(null);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const ob = await window.storage.get(ONBOARDING_KEY);
        if (ob && ob.value === "true") {
          const result = await window.storage.get(STORAGE_KEY);
          if (result && result.value) { setData(JSON.parse(result.value)); setOnboarded(true); return; }
        }
      } catch (e) {}
      setOnboarded(false);
    })();
  }, []);

  const saveData = useCallback(async (newData) => {
    setData(newData);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(newData)); } catch (e) {}
  }, []);

  const handleOnboardingComplete = async (newData) => {
    setData(newData); setOnboarded(true);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(newData)); await window.storage.set(ONBOARDING_KEY, "true"); } catch (e) {}
  };

  const resetAll = async () => {
    try { await window.storage.delete(STORAGE_KEY); await window.storage.delete(ONBOARDING_KEY); } catch (e) {}
    setData(null); setOnboarded(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  if (onboarded === null) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}><NutsyBig size={80} /><p style={{ marginTop: 16, color: "#64748b", fontSize: 14 }}>Chargement...</p></div>
    </div>
  );

  if (!onboarded) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Sora:wght@400;600;700;800&display=swap');
        @keyframes bounceIn { 0% { transform: scale(0.3) rotate(-10deg); opacity: 0; } 50% { transform: scale(1.05) rotate(2deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        * { box-sizing: border-box; } input:focus, select:focus { border-color: #10b981 !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </>
  );

  if (!data) return null;

  // ─── Computed values ──────────────────────────────────────
  const totalIncome = data.incomes.reduce((s, i) => s + (i.frequency === "Hebdomadaire" ? i.amount * 4 : i.amount), 0);
  const totalExpense = data.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalIncome - totalExpense;
  const sr = data.splitRule || {};
  const isFixed = sr.mode === "fixed";
  const split = (() => {
    if (remaining <= 0) return { epargne: 0, investissement: 0, loisirs: 0, projets: 0 };
    if (isFixed) {
      const ep = Math.min(sr.epargneFixed || 0, remaining);
      const inv = Math.min(sr.investissementFixed || 0, remaining - ep);
      const afterPriority = remaining - ep - inv;
      const lo = afterPriority * 0.6;
      const pr = afterPriority * 0.4;
      return { epargne: ep, investissement: inv, loisirs: lo, projets: pr };
    }
    const { epargne: ep2, investissement: inv2, loisirs: lo2, projets: pr2 } = sr;
    const t = (ep2 + inv2 + lo2 + pr2) || 1;
    return { epargne: (remaining*ep2)/t, investissement: (remaining*inv2)/t, loisirs: (remaining*lo2)/t, projets: (remaining*pr2)/t };
  })();
  const disponibleLoisirs = remaining - split.epargne - split.investissement;
  const expByCat = {};
  data.expenses.forEach(e => { expByCat[e.category] = (expByCat[e.category] || 0) + e.amount; });
  const expSegments = Object.entries(expByCat).map(([cat, val]) => ({
    label: cat, value: val, pct: totalExpense > 0 ? (val / totalExpense) * 100 : 0,
    color: expenseCategoryColors[cat] || "#94a3b8", icon: expenseCategoryIcons[cat] || "📦",
  })).sort((a, b) => b.value - a.value);
  const incByCat = {};
  data.incomes.forEach(i => { incByCat[i.category] = (incByCat[i.category] || 0) + (i.frequency === "Hebdomadaire" ? i.amount * 4 : i.amount); });
  const incSegments = Object.entries(incByCat).map(([cat, val]) => ({ label: cat, value: val, pct: totalIncome > 0 ? (val / totalIncome) * 100 : 0, color: incomeCategoryColors[cat] || "#94a3b8" }));

  // ─── Forms ────────────────────────────────────────────────
  const IncomeForm = ({ item, onDone }) => {
    const [name, setName] = useState(item?.name || ""); const [amount, setAmount] = useState(item?.amount || "");
    const [freq, setFreq] = useState(item?.frequency || "Mensuel"); const [cat, setCat] = useState(item?.category || "Salaire");
    const save = () => { if (!name || !amount) return; const ni = item ? data.incomes.map(i => i.id === item.id ? { ...i, name, amount: parseFloat(amount), frequency: freq, category: cat } : i) : [...data.incomes, { id: uid(), name, amount: parseFloat(amount), frequency: freq, category: cat }]; saveData({ ...data, incomes: ni }); showToast(item ? "Revenu modifié !" : "Revenu ajouté ! 🎉"); onDone(); };
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div><label style={labelStyle}>Nom</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div><div><label style={labelStyle}>Montant (€)</label><input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div><div><label style={labelStyle}>Fréquence</label><select style={selectStyle} value={freq} onChange={e => setFreq(e.target.value)}>{INCOME_FREQUENCIES.map(f => <option key={f}>{f}</option>)}</select></div><div><label style={labelStyle}>Catégorie</label><select style={selectStyle} value={cat} onChange={e => setCat(e.target.value)}>{INCOME_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><button style={btnPrimary} onClick={save}>{item ? "Modifier" : "Ajouter"}</button></div>);
  };
  const ExpenseForm = ({ item, onDone }) => {
    const [name, setName] = useState(item?.name || ""); const [amount, setAmount] = useState(item?.amount || "");
    const [freq, setFreq] = useState(item?.frequency || "Mensuelle"); const [cat, setCat] = useState(item?.category || "Vie quotidienne");
    const [sub, setSub] = useState(item?.sub || EXPENSE_SUBS["Vie quotidienne"][0]); const [comment, setComment] = useState(item?.comment || "");
    const save = () => { if (!name || !amount) return; const ne = item ? data.expenses.map(e => e.id === item.id ? { ...e, name, amount: parseFloat(amount), frequency: freq, category: cat, sub, comment } : e) : [...data.expenses, { id: uid(), name, amount: parseFloat(amount), frequency: freq, category: cat, sub, comment }]; saveData({ ...data, expenses: ne }); showToast(item ? "Dépense modifiée !" : "Dépense ajoutée !"); onDone(); };
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div><label style={labelStyle}>Nom</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div><div><label style={labelStyle}>Montant (€)</label><input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div><div><label style={labelStyle}>Catégorie</label><select style={selectStyle} value={cat} onChange={e => { setCat(e.target.value); setSub(EXPENSE_SUBS[e.target.value]?.[0] || ""); }}>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>{EXPENSE_SUBS[cat] && <div><label style={labelStyle}>Sous-catégorie</label><select style={selectStyle} value={sub} onChange={e => setSub(e.target.value)}>{EXPENSE_SUBS[cat].map(s => <option key={s}>{s}</option>)}</select></div>}<div><label style={labelStyle}>Fréquence</label><select style={selectStyle} value={freq} onChange={e => setFreq(e.target.value)}>{EXPENSE_FREQUENCIES.map(f => <option key={f}>{f}</option>)}</select></div><div><label style={labelStyle}>Commentaire</label><input style={inputStyle} value={comment} onChange={e => setComment(e.target.value)} placeholder="Optionnel" /></div><button style={btnPrimary} onClick={save}>{item ? "Modifier" : "Ajouter"}</button></div>);
  };
  const GoalForm = ({ item, onDone }) => {
    const [name, setName] = useState(item?.name || ""); const [target, setTarget] = useState(item?.target || "");
    const [saved, setSaved] = useState(item?.saved || 0); const [icon, setIcon] = useState(item?.icon || "🎯");
    const save = () => { if (!name || !target) return; const ng = item ? data.goals.map(g => g.id === item.id ? { ...g, name, target: parseFloat(target), saved: parseFloat(saved), icon } : g) : [...data.goals, { id: uid(), name, target: parseFloat(target), saved: parseFloat(saved), icon }]; saveData({ ...data, goals: ng }); showToast(item ? "Objectif mis à jour !" : "Objectif créé ! 🎯"); onDone(); };
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><div><label style={labelStyle}>Nom</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{["🎯","🛡️","✈️","🚗","🏠","💰","📚","💍","🏖️","💻"].map(ic => (<button key={ic} onClick={() => setIcon(ic)} style={{ width: 38, height: 38, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center", border: ic === icon ? "2px solid #10b981" : "2px solid #e2e8f0", background: ic === icon ? "#f0fdf4" : "#fff" }}>{ic}</button>))}</div><div><label style={labelStyle}>Montant cible (€)</label><input style={inputStyle} type="number" value={target} onChange={e => setTarget(e.target.value)} /></div><div><label style={labelStyle}>Déjà économisé (€)</label><input style={inputStyle} type="number" value={saved} onChange={e => setSaved(e.target.value)} /></div><button style={btnPrimary} onClick={save}>{item ? "Modifier" : "Créer"}</button></div>);
  };
  const SplitEditor = ({ onDone, inline }) => {
    const sr = data.splitRule || {};
    const [mode, setMode] = useState(sr.mode || "fixed");
    const [epFixed, setEpFixed] = useState(sr.epargneFixed || 0);
    const [invFixed, setInvFixed] = useState(sr.investissementFixed || 0);
    const [ep, setEp] = useState(sr.epargne || 50);
    const [inv, setInv] = useState(sr.investissement || 30);
    const [lo, setLo] = useState(sr.loisirs || 10);
    const [pr, setPr] = useState(sr.projets || 10);
    const pctTotal = ep + inv + lo + pr;

    const previewRemaining = remaining;
    const previewEp = mode === "fixed" ? Math.min(epFixed, previewRemaining) : (previewRemaining * ep) / (pctTotal || 1);
    const previewInv = mode === "fixed" ? Math.min(invFixed, previewRemaining - previewEp) : (previewRemaining * inv) / (pctTotal || 1);
    const previewDispo = Math.max(0, previewRemaining - previewEp - previewInv);

    const save = () => {
      saveData({ ...data, splitRule: { mode, epargneFixed: parseFloat(epFixed) || 0, investissementFixed: parseFloat(invFixed) || 0, epargne: ep, investissement: inv, loisirs: lo, projets: pr } });
      showToast("Profil mis à jour !");
      if (onDone) onDone();
    };
    const canSave = mode === "fixed" || pctTotal === 100;

    const cardBg = inline ? "transparent" : "#fff";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!inline && <Nutsy size={40} message="Configure combien tu mets de côté chaque mois !" />}

        {/* Mode selector */}
        <div>
          <label style={labelStyle}>Mode de répartition</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ id: "fixed", label: "Montant fixe", desc: "Je choisis combien" }, { id: "pct", label: "Pourcentage", desc: "Répartition auto" }].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                flex: 1, background: mode === m.id ? "#f0fdf4" : "#fff", border: mode === m.id ? "2px solid #10b981" : "2px solid #e2e8f0",
                borderRadius: 14, padding: "12px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: mode === m.id ? "#059669" : "#334155" }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {mode === "fixed" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>🏦 Épargne mensuelle (€)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input style={{ ...inputStyle, flex: 1 }} type="number" value={epFixed} onChange={e => setEpFixed(e.target.value)} placeholder="Ex: 300" />
                <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700, whiteSpace: "nowrap" }}>{remaining > 0 ? Math.round((Math.min(epFixed, remaining) / remaining) * 100) : 0}%</span>
              </div>
              <input type="range" min={0} max={Math.max(remaining, 0)} step={10} value={Math.min(epFixed, remaining)} onChange={e => setEpFixed(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#10b981", marginTop: 6 }} />
            </div>
            <div>
              <label style={labelStyle}>📈 Investissement mensuel (€)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input style={{ ...inputStyle, flex: 1 }} type="number" value={invFixed} onChange={e => setInvFixed(e.target.value)} placeholder="Ex: 150" />
                <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 700, whiteSpace: "nowrap" }}>{remaining > 0 ? Math.round((Math.min(invFixed, remaining) / remaining) * 100) : 0}%</span>
              </div>
              <input type="range" min={0} max={Math.max(remaining - previewEp, 0)} step={10} value={Math.min(invFixed, remaining - previewEp)} onChange={e => setInvFixed(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6", marginTop: 6 }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ l: "🏦 Épargne", v: ep, s: setEp, c: "#10b981" }, { l: "📈 Investissement", v: inv, s: setInv, c: "#3b82f6" }, { l: "🎉 Loisirs", v: lo, s: setLo, c: "#f59e0b" }, { l: "🚀 Projets", v: pr, s: setPr, c: "#8b5cf6" }].map(x => (
              <div key={x.l}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ ...labelStyle, margin: 0 }}>{x.l}</label>
                  <span style={{ fontSize: 14, fontWeight: 800, color: x.c }}>{x.v}%</span>
                </div>
                <input type="range" min={0} max={100} value={x.v} onChange={e => x.s(parseInt(e.target.value))} style={{ width: "100%", accentColor: x.c }} />
                <div style={{ fontSize: 12, color: x.c, fontWeight: 600, textAlign: "right" }}>{fmt((remaining * x.v) / (pctTotal || 1))}€/mois</div>
              </div>
            ))}
            <div style={{ textAlign: "center", fontSize: 13, color: pctTotal === 100 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
              Total : {pctTotal}%{pctTotal !== 100 && " (doit faire 100%)"}
            </div>
          </div>
        )}

        {/* Live preview */}
        <div style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)", borderRadius: 16, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 10 }}>Aperçu mensuel</div>
          {[
            { l: "Épargne", v: previewEp, c: "#10b981", i: "🏦" },
            { l: "Investissement", v: previewInv, c: "#3b82f6", i: "📈" },
          ].map(x => (
            <div key={x.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 13, color: "#475569" }}>{x.i} {x.l}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: x.c, fontFamily: "'Sora', sans-serif" }}>-{fmt(x.v)}€</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 0", marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>🎉 Disponible loisirs & projets</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: previewDispo > 0 ? "#f59e0b" : "#ef4444", fontFamily: "'Sora', sans-serif" }}>{fmt(previewDispo)}€</span>
          </div>
        </div>

        <button style={{ ...btnPrimary, opacity: canSave ? 1 : 0.4 }} onClick={save} disabled={!canSave}>
          Enregistrer mon profil
        </button>
      </div>
    );
  };

  const deleteIncome = (id) => { saveData({ ...data, incomes: data.incomes.filter(i => i.id !== id) }); showToast("Supprimé"); };
  const deleteExpense = (id) => { saveData({ ...data, expenses: data.expenses.filter(e => e.id !== id) }); showToast("Supprimé"); };
  const deleteGoal = (id) => { saveData({ ...data, goals: data.goals.filter(g => g.id !== id) }); showToast("Supprimé"); };

  const nutsyMsg = remaining <= 0 ? { msg: "Attention, tes dépenses dépassent tes revenus ! 😟", mood: "sad" }
    : (remaining / totalIncome) > 0.4 ? { msg: `Bravo ${data.userName} ! Tu gardes ${((remaining / totalIncome) * 100).toFixed(0)}% de tes revenus 🎉`, mood: "happy" }
    : (remaining / totalIncome) > 0.2 ? { msg: `Pas mal ${data.userName} ! Tu peux encore optimiser 💪`, mood: "happy" }
    : { msg: "C'est serré ce mois-ci. Regarde tes abonnements 🔍", mood: "sad" };

  const navItems = [{ id: "dashboard", icon: "📊", label: "Accueil" },{ id: "incomes", icon: "💰", label: "Revenus" },{ id: "expenses", icon: "💸", label: "Dépenses" },{ id: "goals", icon: "🎯", label: "Objectifs" },{ id: "profil", icon: "⚙️", label: "Profil" }];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(180deg, #f8fafc 0%, #f0fdf4 50%, #f8fafc 100%)", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Sora:wght@400;600;700;800&display=swap');
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; } input:focus, select:focus { border-color: #10b981 !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #059669, #10b981, #34d399)", padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 22 }}>🐿️</span><h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif" }}>BudgetFlow</h1></div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Bonjour {data.userName} !</p>
          </div>
          <button onClick={resetAll} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "8px 12px", color: "#fff", fontSize: 11, cursor: "pointer" }}>↻ Reset</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[{ label: "Revenus", value: `${fmt(totalIncome)}€`, bg: "rgba(255,255,255,0.15)" },{ label: "Dépenses", value: `${fmt(totalExpense)}€`, bg: "rgba(255,255,255,0.12)" },{ label: "Reste", value: `${fmt(remaining)}€`, bg: remaining >= 0 ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.3)" }].map((c, i) => (
            <div key={i} style={{ background: c.bg, borderRadius: 16, padding: "14px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif", marginTop: 4 }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {view === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card delay={0}><Nutsy size={44} message={nutsyMsg.msg} mood={nutsyMsg.mood} /></Card>
            {/* Waterfall: where does your money go? */}
            <Card delay={100}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontFamily: "'Sora', sans-serif" }}>Où va ton argent ?</h3>
                <button onClick={() => setView("profil")} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#059669", cursor: "pointer", fontWeight: 600 }}>⚙️ Modifier</button>
              </div>

              {/* Waterfall bars */}
              {[
                { l: "Revenus", v: totalIncome, c: "#10b981", icon: "💰", full: true },
                { l: "Dépenses", v: -totalExpense, c: "#ef4444", icon: "💸", sub: true },
                { l: "= Reste", v: remaining, c: remaining >= 0 ? "#0f172a" : "#ef4444", icon: "📊", bold: true },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: x.bold ? "2px solid #e2e8f0" : "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 16, width: 24 }}>{x.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: "#475569", fontWeight: x.bold ? 700 : 400 }}>{x.l}</span>
                  <span style={{ fontSize: x.bold ? 16 : 14, fontWeight: x.bold ? 800 : 700, color: x.c, fontFamily: "'Sora', sans-serif" }}>
                    {x.v >= 0 ? "" : ""}{fmt(Math.abs(x.v))}€
                  </span>
                </div>
              ))}

              {remaining > 0 && <>
                {/* Priority deductions */}
                <div style={{ marginTop: 10, marginBottom: 6, fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Mis de côté automatiquement</div>
                {[
                  { l: "Épargne", v: split.epargne, c: "#10b981", icon: "🏦" },
                  { l: "Investissement", v: split.investissement, c: "#3b82f6", icon: "📈" },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                    <span style={{ fontSize: 14, width: 24 }}>{x.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: "#475569" }}>{x.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: x.c }}>-{fmt(x.v)}€</span>
                  </div>
                ))}

                {/* THE KEY: what's left for fun */}
                <div style={{
                  marginTop: 12, background: "linear-gradient(135deg, #fffbeb, #fef3c7)", borderRadius: 14,
                  padding: "14px 16px", border: "1px solid #fde68a",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>🎉 Dispo loisirs & projets</div>
                    <div style={{ fontSize: 11, color: "#a16207", marginTop: 2 }}>Ce qu'il te reste à dépenser librement</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#d97706", fontFamily: "'Sora', sans-serif" }}>
                    {fmt(disponibleLoisirs)}€
                  </div>
                </div>
              </>}

              {/* Mini donut */}
              {remaining > 0 && <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <DonutChart size={120} thickness={20} centerLabel="Reste" centerValue={`${fmt(remaining)}€`} segments={[
                  { pct: remaining > 0 ? (split.epargne / remaining) * 100 : 0, color: "#10b981" },
                  { pct: remaining > 0 ? (split.investissement / remaining) * 100 : 0, color: "#3b82f6" },
                  { pct: remaining > 0 ? (disponibleLoisirs / remaining) * 100 : 0, color: "#f59e0b" },
                ]} />
              </div>}
            </Card>
            <Card delay={200}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "'Sora', sans-serif" }}>Dépenses par catégorie</h3>
              {expSegments.length > 0 ? (
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <DonutChart size={120} thickness={20} centerLabel="Total" centerValue={`${fmt(totalExpense)}€`} segments={expSegments.map(s => ({ pct: s.pct, color: s.color }))} />
                  <div style={{ flex: 1 }}>{expSegments.map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{s.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{s.label}</div><ProgressBar pct={s.pct} color={s.color} height={6} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(s.value)}€</span>
                    </div>
                  ))}</div>
                </div>
              ) : <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center" }}>Aucune dépense enregistrée</p>}
            </Card>
            {data.goals.length > 0 && (
              <Card delay={300}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "'Sora', sans-serif" }}>Mes objectifs</h3>
                {data.goals.map(g => { const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0; return (
                  <div key={g.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{g.icon} {g.name}</span><span style={{ fontSize: 12, color: "#64748b" }}>{fmt(g.saved)}€ / {fmt(g.target)}€</span></div>
                    <ProgressBar pct={pct} color={pct >= 100 ? "#10b981" : "#3b82f6"} height={8} />
                  </div>
                ); })}
              </Card>
            )}
          </div>
        )}

        {view === "incomes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Sora', sans-serif" }}>Mes Revenus</h2>
              <button onClick={() => { setEditItem(null); setModal("income"); }} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
            </div>
            {incSegments.length > 0 && <Card delay={0}><div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><DonutChart size={130} thickness={22} centerLabel="Revenus" centerValue={`${fmt(totalIncome)}€`} segments={incSegments.map(s => ({ pct: s.pct, color: s.color }))} /></div></Card>}
            {data.incomes.map((inc, i) => (
              <Card key={inc.id} delay={i * 80}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 700 }}>{inc.name}</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}><span style={{ background: incomeCategoryColors[inc.category] + "20", color: incomeCategoryColors[inc.category], padding: "2px 8px", borderRadius: 6, fontWeight: 600, fontSize: 11 }}>{inc.category}</span><span style={{ marginLeft: 8 }}>{inc.frequency}</span></div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 17, fontWeight: 800, color: "#059669", fontFamily: "'Sora', sans-serif" }}>+{fmt(inc.amount)}€</div><div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "flex-end" }}><button onClick={() => { setEditItem(inc); setModal("income"); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>✏️</button><button onClick={() => deleteIncome(inc.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>🗑️</button></div></div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {view === "expenses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Sora', sans-serif" }}>Mes Dépenses</h2>
              <button onClick={() => { setEditItem(null); setModal("expense"); }} style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
            </div>
            {expSegments.length > 0 && <Card delay={0}><div style={{ display: "flex", gap: 16, alignItems: "center" }}><DonutChart size={120} thickness={20} centerLabel="Total" centerValue={`${fmt(totalExpense)}€`} segments={expSegments.map(s => ({ pct: s.pct, color: s.color }))} /><div style={{ flex: 1 }}>{expSegments.map(s => (<div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{s.icon}</span><span style={{ flex: 1, fontSize: 12, color: "#475569" }}>{s.label}</span><span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{fmt(s.value)}€</span></div>))}</div></div></Card>}
            {EXPENSE_CATEGORIES.map(cat => {
              const items = data.expenses.filter(e => e.category === cat); if (!items.length) return null;
              return (<div key={cat}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, marginTop: 4 }}><span style={{ fontSize: 16 }}>{expenseCategoryIcons[cat]}</span><span style={{ fontSize: 13, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>{cat}</span><span style={{ fontSize: 12, color: expenseCategoryColors[cat], fontWeight: 700 }}>{fmt(items.reduce((s, e) => s + e.amount, 0))}€</span></div>
                {items.map((exp, i) => (<Card key={exp.id} delay={i * 60} style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{exp.name}</div><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{exp.sub && <span style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, marginRight: 6 }}>{exp.sub}</span>}{exp.frequency}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444", fontFamily: "'Sora', sans-serif" }}>-{fmt(exp.amount)}€</div><div style={{ display: "flex", gap: 6, marginTop: 4, justifyContent: "flex-end" }}><button onClick={() => { setEditItem(exp); setModal("expense"); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>✏️</button><button onClick={() => deleteExpense(exp.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>🗑️</button></div></div></div></Card>))}
              </div>);
            })}
          </div>
        )}

        {view === "goals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Sora', sans-serif" }}>Objectifs</h2>
              <button onClick={() => { setEditItem(null); setModal("goal"); }} style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "#fff", border: "none", borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Objectif</button>
            </div>
            <Card delay={0}><Nutsy size={40} message="Définis tes rêves et je t'aide à les atteindre ! ✨" /></Card>
            {data.goals.map((g, i) => { const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0; const rem = g.target - g.saved; const mo = split.projets > 0 ? Math.ceil(Math.max(rem, 0) / split.projets) : Infinity; return (
              <Card key={g.id} delay={(i+1)*100}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: pct >= 100 ? "linear-gradient(135deg, #dcfce7, #bbf7d0)" : "linear-gradient(135deg, #ede9fe, #ddd6fe)", display: "grid", placeItems: "center", fontSize: 28, flexShrink: 0 }}>{g.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 15, fontWeight: 700 }}>{g.name}</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{pct >= 100 ? "🎉 Atteint !" : `~${mo < Infinity ? mo + " mois" : "..."}`}</div></div><div style={{ display: "flex", gap: 4 }}><button onClick={() => { setEditItem(g); setModal("goal"); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>✏️</button><button onClick={() => deleteGoal(g.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 8, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>🗑️</button></div></div>
                    <div style={{ margin: "10px 0 4px" }}><ProgressBar pct={pct} color={pct >= 100 ? "#10b981" : "#8b5cf6"} height={12} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ fontWeight: 700, color: pct >= 100 ? "#059669" : "#7c3aed", fontFamily: "'Sora', sans-serif" }}>{fmt(g.saved)}€</span><span style={{ color: "#94a3b8" }}>{pct.toFixed(0)}%</span><span style={{ color: "#64748b", fontWeight: 600 }}>{fmt(g.target)}€</span></div>
                  </div>
                </div>
              </Card>
            ); })}
            {data.goals.length === 0 && <Card delay={100} style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div><p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>Aucun objectif</p></Card>}
          </div>
        )}

        {view === "profil" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Sora', sans-serif" }}>Mon Profil Budget</h2>
            <Card delay={0}><Nutsy size={44} message={`${data.userName}, ajuste ton profil à tout moment ! Tu peux choisir exactement combien mettre de côté 🎯`} /></Card>

            {/* Inline split editor */}
            <Card delay={100}>
              <SplitEditor inline />
            </Card>

            {/* Simulation */}
            <Card delay={200}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "'Sora', sans-serif" }}>📊 Simulation sur 12 mois</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ l: "Épargne cumulée", v: split.epargne * 12, c: "#10b981", i: "🏦" },{ l: "Investissements", v: split.investissement * 12, c: "#3b82f6", i: "📈" },{ l: "Budget loisirs", v: disponibleLoisirs * 12, c: "#f59e0b", i: "🎉" }].map(x => (
                  <div key={x.l} style={{ background: `${x.c}10`, borderRadius: 14, padding: 12, border: `1px solid ${x.c}25`, textAlign: "center" }}>
                    <span style={{ fontSize: 22 }}>{x.i}</span>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{x.l}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: x.c, fontFamily: "'Sora', sans-serif", marginTop: 4 }}>{fmt(x.v)}€</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth chart */}
            <Card delay={300}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "'Sora', sans-serif" }}>Croissance de l'épargne</h3>
              <BarChart data={Array.from({ length: 6 }, (_, i) => ({ label: `M${(i+1)*2}`, value: split.epargne*(i+1)*2, color: `hsl(${152-i*3},76%,${42+i*4}%)` }))} />
            </Card>

            {/* Suggestions */}
            <Card delay={400}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "'Sora', sans-serif" }}>💡 Conseils de Nutsy</h3>
              {[
                { t: `Avec ${fmt(split.epargne)}€/mois d'épargne, tu auras ${fmt(split.epargne * 6)}€ en 6 mois !`, c: "#10b981" },
                { t: `Il te reste ${fmt(disponibleLoisirs)}€/mois pour tes loisirs et projets perso.`, c: "#f59e0b" },
                { t: "Investis régulièrement, même de petites sommes. L'effet composé fait des miracles.", c: "#3b82f6" },
                disponibleLoisirs < 50 ? { t: "Ton budget loisirs est serré. Revois tes dépenses non essentielles.", c: "#ef4444" } : null,
              ].filter(Boolean).map((s,i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "start", marginBottom: 8, padding: "10px 12px", background: `${s.c}08`, borderRadius: 12, borderLeft: `3px solid ${s.c}` }}>
                  <span style={{ fontSize: 12 }}>🐿️</span><span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{s.t}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px" }}>
            <span style={{ fontSize: 22, filter: view === n.id ? "none" : "grayscale(0.5) opacity(0.6)" }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: view === n.id ? 700 : 500, color: view === n.id ? "#059669" : "#94a3b8" }}>{n.label}</span>
            {view === n.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: "#10b981", marginTop: 1 }} />}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#0f172a", color: "#fff", padding: "12px 20px", borderRadius: 14, fontSize: 14, fontWeight: 600, zIndex: 2000, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}><span>🐿️</span> {toast}</div>}

      {/* Modals */}
      <Modal open={modal === "income"} onClose={() => { setModal(null); setEditItem(null); }} title={editItem ? "Modifier" : "Ajouter un revenu"}><IncomeForm item={editItem} onDone={() => { setModal(null); setEditItem(null); }} /></Modal>
      <Modal open={modal === "expense"} onClose={() => { setModal(null); setEditItem(null); }} title={editItem ? "Modifier" : "Ajouter une dépense"}><ExpenseForm item={editItem} onDone={() => { setModal(null); setEditItem(null); }} /></Modal>
      <Modal open={modal === "goal"} onClose={() => { setModal(null); setEditItem(null); }} title={editItem ? "Modifier" : "Nouvel objectif"}><GoalForm item={editItem} onDone={() => { setModal(null); setEditItem(null); }} /></Modal>
      <Modal open={modal === "split"} onClose={() => setModal(null)} title="Mon Profil Budget"><SplitEditor onDone={() => setModal(null)} /></Modal>
    </div>
  );
}
