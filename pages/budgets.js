import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/api";
import {
  Settings2,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Car,
  ShoppingBag,
  Receipt,
  MoreHorizontal,
  Box,
  X,
  TrendingUp,
  Trash2,
  ChevronDown,
  Check,
  Utensils,
  Film,
  HeartPulse,
  Home,
  Lightbulb,
  GraduationCap,
  Smile,
  Plane,
  Calendar,
  Gift,
  Shield,
  FileText,
  HelpCircle,
  Wallet,
  Edit3,
  Save
} from "lucide-react";
import OptimizeModal from "../components/OptimizeModal";
import computeBudgetSuggestions from "../utils/budgetOptimizer";
import { useToast } from "../components/ToastProvider";

const EXPENSE_CATEGORIES = [
  { value: "Food & Dining", label: "Food & Dining", icon: Utensils, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { value: "Transportation", label: "Transportation", icon: Car, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { value: "Shopping", label: "Shopping", icon: ShoppingBag, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { value: "Entertainment", label: "Entertainment", icon: Film, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { value: "Health & Fitness", label: "Health & Fitness", icon: HeartPulse, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  { value: "Housing & Rent", label: "Housing & Rent", icon: Home, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { value: "Utilities", label: "Utilities", icon: Lightbulb, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  { value: "Education", label: "Education", icon: GraduationCap, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  { value: "Personal Care", label: "Personal Care", icon: Smile, color: "text-teal-500", bgColor: "bg-teal-500/10" },
  { value: "Travel", label: "Travel", icon: Plane, color: "text-sky-500", bgColor: "bg-sky-500/10" },
  { value: "Subscriptions", label: "Subscriptions", icon: Calendar, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  { value: "Gifts & Donations", label: "Gifts & Donations", icon: Gift, color: "text-red-500", bgColor: "bg-red-500/10" },
  { value: "Insurance", label: "Insurance", icon: Shield, color: "text-blue-600", bgColor: "bg-blue-600/10" },
  { value: "Taxes", label: "Taxes", icon: FileText, color: "text-slate-500", bgColor: "bg-slate-500/10" },
  { value: "Miscellaneous", label: "Miscellaneous", icon: HelpCircle, color: "text-gray-500", bgColor: "bg-gray-500/10" }
];

export default function Budgets() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food & Dining");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null); // budget object being edited
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState('success');

  // Monthly budget state
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const [monthlyInput, setMonthlyInput] = useState("");
  const [savingMonthly, setSavingMonthly] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchBudgets = async (userId) => {
    try {
      setLoading(true);
      const [budgetsRes, analyticsRes, transactionsRes] = await Promise.all([
        API.get(`/budgets?userId=${userId}`),
        API.get(`/analytics?userId=${userId}`),
        API.get(`/transactions?userId=${userId}`)
      ]);
      const breakdown = analyticsRes.data.breakdown || {};
      const enrichedBudgets = budgetsRes.data.map(b => ({
        ...b,
        spentAmount: breakdown[b.category] || 0
      }));
      setBudgets(enrichedBudgets);
      setTransactions(transactionsRes.data || []);
      setTotalSpent(analyticsRes.data.expense || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setError("Failed to load budgets.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("bw_user");
    if (!savedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(savedUser);
    fetchBudgets(user.id);

    // Load monthly budget from preferences
    try {
      const prefs = user.preferences
        ? (typeof user.preferences === "string" ? JSON.parse(user.preferences) : user.preferences)
        : {};
      setMonthlyBudget(prefs.monthlyBudget || 0);
      setMonthlyInput(String(prefs.monthlyBudget || ""));
    } catch { }
  }, []);

  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);
  const { showToast } = useToast();

  const suggestions = computeBudgetSuggestions({ analytics: { breakdown: {}, income: 0, expense: totalSpent }, budgets, transactions, monthlyBudget });

  const handleApplySuggestions = async (accepted) => {
    if (!accepted || accepted.length === 0) return;
    const savedUser = localStorage.getItem('bw_user');
    const userId = savedUser ? JSON.parse(savedUser).id : null;
    if (!userId) {
      setStatusMessage('No user session');
      setStatusType('error');
      showToast('No user session', { type: 'error' });
      return;
    }
    try {
      await API.post('/budgets/optimize', { userId, suggestions: accepted.map(s => ({ category: s.category, suggestedLimit: s.suggestedLimit })) });
      await fetchBudgets(userId);
      setStatusMessage('Applied budget suggestions successfully.');
      setStatusType('success');
      showToast('Applied budget suggestions', { type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to apply suggestions.');
      setStatusType('error');
      showToast('Failed to apply suggestions.', { type: 'error' });
    }
  };

  const handleSaveMonthlyBudget = async () => {
    const amount = parseFloat(monthlyInput);
    if (isNaN(amount) || amount < 0) return;
    setSavingMonthly(true);
    try {
      const savedUser = localStorage.getItem("bw_user");
      if (!savedUser) return;
      const user = JSON.parse(savedUser);
      const prefs = user.preferences
        ? (typeof user.preferences === "string" ? JSON.parse(user.preferences) : user.preferences)
        : {};
      const newPrefs = { ...prefs, monthlyBudget: amount };
      await API.post("/user/update", {
        userId: user.id,
        name: user.name,
        email: user.email,
        password: "",
        preferences: JSON.stringify(newPrefs)
      });
      // Update localStorage with new prefs
      const updated = { ...user, preferences: newPrefs };
      localStorage.setItem("bw_user", JSON.stringify(updated));
      setMonthlyBudget(amount);
      setIsEditingMonthly(false);
    } catch (err) {
      console.error("Failed to save monthly budget", err);
    } finally {
      setSavingMonthly(false);
    }
  };


  const getPercentage = (spent, limit) => Math.min(Math.round((spent / (limit || 1)) * 100), 100);

  const getStatusInfo = (percentage) => {
    if (percentage >= 100) return {
      color: "bg-rose-500",
      textColor: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      icon: <AlertCircle className="w-4 h-4 mr-1 text-rose-500" />,
      text: "Exceeded"
    };
    if (percentage >= 85) return {
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      icon: <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />,
      text: "Near limit"
    };
    return {
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />,
      text: "Safe"
    };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food":
      case "Food & Dining": return <Utensils className="w-6 h-6 text-orange-500" />;
      case "Transport":
      case "Transportation": return <Car className="w-6 h-6 text-blue-500" />;
      case "Shopping": return <ShoppingBag className="w-6 h-6 text-purple-500" />;
      case "Bills":
      case "Utilities": return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      case "Entertainment": return <Film className="w-6 h-6 text-pink-500" />;
      case "Health & Fitness": return <HeartPulse className="w-6 h-6 text-rose-500" />;
      case "Housing & Rent": return <Home className="w-6 h-6 text-amber-500" />;
      case "Education": return <GraduationCap className="w-6 h-6 text-indigo-500" />;
      case "Personal Care": return <Smile className="w-6 h-6 text-teal-500" />;
      case "Travel": return <Plane className="w-6 h-6 text-sky-500" />;
      case "Subscriptions": return <Calendar className="w-6 h-6 text-violet-500" />;
      case "Gifts & Donations": return <Gift className="w-6 h-6 text-red-500" />;
      case "Insurance": return <Shield className="w-6 h-6 text-blue-600" />;
      case "Taxes": return <FileText className="w-6 h-6 text-slate-500" />;
      case "Miscellaneous": return <HelpCircle className="w-6 h-6 text-gray-500" />;
      default: return <Box className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);

    const savedUser = localStorage.getItem("bw_user");
    const userId = savedUser ? JSON.parse(savedUser).id : null;
    if (!userId) { setSubmitting(false); return; }

    const payload = {
      userId: userId,
      category: formData.get("category"),
      limit: parseFloat(formData.get("limit"))
    };

    try {
      await API.post("/budget", payload);
      await fetchBudgets(userId);
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (err) {
      console.error("Error setting budget:", err);
      showToast("Failed to update budget. Is the C++ server running?", { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (category) => {
    setConfirmDelete(category);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setSelectedCategory(budget.category);
    setIsModalOpen(true);
  };

  const confirmDeleteBudget = async () => {
    const category = confirmDelete;
    setConfirmDelete(null);
    const savedUser = localStorage.getItem("bw_user");
    const userId = savedUser ? JSON.parse(savedUser).id : null;
    if (!userId) return;

    try {
      await API.post("/budget/delete", { userId, category });
      await fetchBudgets(userId);
    } catch (err) {
      console.error("Error deleting budget:", err);
      showToast("Failed to delete budget. Is the C++ server running?", { type: 'error' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Budgets | BudgetWise</title>
      </Head>
      <DashboardLayout>

        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Budgets</h1>
            <p className="text-sm sm:text-base text-text-secondary mt-1 font-medium opacity-60">Manage spending thresholds via C++ Analytics Engine.</p>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOptimizeOpen(true)}
                className="px-4 py-3 bg-bg-elevated text-text-secondary text-sm font-bold rounded-2xl hover:bg-bg-elevated/80 hover:text-text-primary transition-all border border-border-subtle"
              >
                Quick Optimize
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-6 py-3.5 bg-accent-primary text-bg-main rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-accent-primary/20 active:scale-95"
              >
                <Settings2 size={18} className="mr-2" />
                Configure Bounds
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className={`mb-6 rounded-3xl border p-3 text-sm font-semibold flex items-center justify-between gap-4 ${statusType === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
            <div className="flex-1">{statusMessage}</div>
            <button onClick={() => setStatusMessage(null)} className="p-2 rounded-full text-current opacity-70 hover:bg-bg-elevated hover:opacity-100 transition-all">
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Monthly Budget Hero Card ── */}
        {(() => {
          const pct = monthlyBudget > 0 ? Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100) : 0;
          const remaining = Math.max(monthlyBudget - totalSpent, 0);
          const isOver = monthlyBudget > 0 && totalSpent > monthlyBudget;
          const isWarn = !isOver && pct >= 80;
          const statusColor = isOver ? "text-rose-500" : isWarn ? "text-amber-500" : "text-emerald-500";
          const barColor = isOver ? "bg-rose-500" : isWarn ? "bg-amber-500" : "bg-emerald-500";
          const glowColor = isOver ? "shadow-rose-500/20" : isWarn ? "shadow-amber-500/20" : "shadow-emerald-500/20";
          const statusLabel = isOver ? "Over Budget" : isWarn ? "Near Limit" : monthlyBudget > 0 ? "On Track" : "Not Set";
          const circumference = 2 * Math.PI * 34;
          const dashOffset = circumference - (pct / 100) * circumference;
          return (
            <div className={`mb-10 bg-bg-surface rounded-[2.5rem] border border-border-subtle shadow-2xl ${glowColor} overflow-hidden`}>
              <div className="flex flex-col lg:flex-row items-center gap-0">
                {/* Left – summary */}
                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-3 bg-accent-primary/10 rounded-2xl">
                      <Wallet className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Global Monthly Budget</p>
                      <p className="text-[11px] font-bold text-text-secondary opacity-50">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {isEditingMonthly ? (
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-3xl font-black text-text-secondary">$</span>
                      <input
                        autoFocus
                        type="number"
                        min="0"
                        value={monthlyInput}
                        onChange={e => setMonthlyInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveMonthlyBudget(); if (e.key === 'Escape') setIsEditingMonthly(false); }}
                        className="text-4xl font-black text-text-primary bg-bg-elevated border border-border-subtle rounded-2xl px-4 py-2 w-44 outline-none focus:ring-4 focus:ring-accent-primary/20"
                      />
                      <button onClick={handleSaveMonthlyBudget} disabled={savingMonthly} className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setIsEditingMonthly(false)} className="p-3 bg-bg-elevated text-text-secondary rounded-2xl hover:bg-bg-surface active:scale-95 transition-all border border-border-subtle">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3 mb-5">
                      <span className="text-4xl font-black text-text-primary tracking-tighter">
                        {monthlyBudget > 0 ? `$${monthlyBudget.toLocaleString()}` : "—"}
                      </span>
                      <button onClick={() => { setIsEditingMonthly(true); setMonthlyInput(String(monthlyBudget || "")); }} className="mb-1.5 p-2 text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-xl transition-all" title="Edit monthly budget">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-subtle">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-1">Spent</p>
                      <p className="text-xl font-black text-rose-500">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-subtle">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-1">Remaining</p>
                      <p className={`text-xl font-black ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {monthlyBudget > 0 ? (isOver ? `-$${(totalSpent - monthlyBudget).toLocaleString()}` : `$${remaining.toLocaleString()}`) : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right – radial ring + bar */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-10 lg:border-l border-border-subtle gap-5 w-full lg:w-auto">
                  {/* SVG Ring */}
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-bg-elevated" strokeWidth="8" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke="currentColor"
                        className={statusColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={monthlyBudget > 0 ? dashOffset : circumference}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xl font-black ${statusColor}`}>{monthlyBudget > 0 ? `${pct}%` : '—'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${isOver ? 'bg-rose-500/10 text-rose-500' : isWarn ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {statusLabel}
                  </span>
                  {/* Progress bar */}
                  <div className="w-36 bg-bg-elevated rounded-full h-2 overflow-hidden border border-border-subtle">
                    <div className={`h-2 rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-text-secondary font-bold opacity-50 uppercase tracking-wider">of monthly limit</p>
                </div>
              </div>
            </div>
          );
        })()}

        {error ? (
          <div className="p-20 text-center bg-bg-surface rounded-[2.5rem] border border-rose-500/10 shadow-xl shadow-text-primary/5">
            <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-6 opacity-50" />
            <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{error}</h3>
            <p className="text-text-secondary mt-2 text-sm opacity-60">Check your C++ API connection.</p>
            <button
              onClick={fetchBudgets}
              className="mt-8 px-8 py-3 bg-accent-primary text-bg-main rounded-xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 shadow-xl shadow-accent-primary/20 transition-all active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-20 text-center bg-bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl shadow-text-primary/5">
            <Box className="mx-auto h-12 w-12 text-text-secondary mb-6 opacity-20" />
            <h3 className="text-xl font-extrabold text-text-primary uppercase tracking-widest opacity-60">No budgets defined</h3>
            <p className="text-text-secondary mt-2 text-sm opacity-40">Initialize your first spending limit to begin tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget, index) => {
              const spent = budget.spentAmount || 0;
              const limit = budget.monthlyLimit || 1;
              const percentage = getPercentage(spent, limit);
              const status = getStatusInfo(percentage);

              return (
                <div
                  key={index}
                  className={`bg-bg-surface rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle p-7 hover:shadow-2xl hover:shadow-accent-primary/5 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="p-3.5 bg-bg-elevated/50 rounded-2xl mr-4 border border-border-subtle group-hover:bg-bg-surface transition-colors">
                        {getCategoryIcon(budget.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-text-primary tracking-tight uppercase">{budget.category}</h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-0.5 opacity-60">Monthly Limit</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditBudget(budget)}
                      className="p-2 text-text-secondary opacity-30 hover:opacity-100 hover:text-accent-primary transition-colors"
                      title="Edit Budget"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.category)}
                      className="p-2 text-text-secondary opacity-30 hover:opacity-100 hover:text-rose-500 transition-colors"
                      title="Delete Budget"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div className="text-2xl font-black text-text-primary tracking-tighter">
                      ${spent.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-bold text-text-secondary mb-1 opacity-60 uppercase tracking-widest">
                      of ${limit.toLocaleString()}
                    </div>
                  </div>

                  <div className="w-full bg-bg-elevated rounded-full h-2.5 mb-5 overflow-hidden shadow-inner border border-border-subtle">
                    <div
                      className={`h-2.5 rounded-full ${status.color} transition-all duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${status.bgColor} ${status.textColor} border border-transparent group-hover:border-current`}>
                      {status.icon}
                      {status.text}
                    </span>
                    <span className="text-[11px] font-black text-text-secondary opacity-60 italic">{percentage}% consumed</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <OptimizeModal open={isOptimizeOpen} onClose={() => setIsOptimizeOpen(false)} suggestions={suggestions} onApply={handleApplySuggestions} />

        {/* Set Budget Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-border-subtle">
              <div className="flex justify-between items-center px-8 py-7 bg-bg-elevated/30 border-b border-border-subtle">
                <div>
                  <h3 className="text-xl font-extrabold text-text-primary tracking-tight">
                    {editingBudget ? "Modify Threshold" : "Configure Thresholds"}
                  </h3>
                  <p className="text-[11px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Analytics Limit Protocol</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingBudget(null); }} className="p-2 bg-bg-surface rounded-xl text-text-secondary hover:text-text-primary shadow-sm hover:shadow transition-all active:scale-95">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSetBudget} className="p-8 space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Control Category</label>

                  {/* Hidden Input for Form Submission */}
                  <input type="hidden" name="category" value={selectedCategory} />

                  {/* Custom Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl text-left text-text-primary font-bold flex items-center justify-between hover:bg-bg-surface transition-all focus:ring-4 focus:ring-accent-primary/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1 rounded bg-bg-main">
                        {getCategoryIcon(selectedCategory)}
                      </div>
                      <span>{selectedCategory}</span>
                    </div>
                    <ChevronDown size={18} className={`text-text-secondary transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options List */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-bg-surface border border-border-subtle rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar p-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {EXPENSE_CATEGORIES.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.value);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${selectedCategory === cat.value
                              ? "bg-accent-primary/10 text-accent-primary"
                              : "text-text-primary hover:bg-bg-elevated"
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-1.5 rounded-lg ${cat.bgColor} ${cat.color}`}>
                                <IconComponent size={16} />
                              </div>
                              <span>{cat.label}</span>
                            </div>
                            {selectedCategory === cat.value && <Check size={16} className="text-accent-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Monthly Bound ($)</label>
                  <input
                    name="limit"
                    type="number"
                    step="10"
                    min="0"
                    required
                    defaultValue={editingBudget ? editingBudget.monthlyLimit : ""}
                    className="w-full px-5 py-4 bg-bg-elevated border-none rounded-2xl focus:ring-4 focus:ring-accent-primary/10 focus:bg-bg-surface text-text-primary font-bold placeholder-text-secondary transition-all outline-none"
                    placeholder="e.g., 500"
                  />
                  <p className="text-[9px] text-text-secondary mt-2 pl-1 font-bold opacity-40 uppercase tracking-tight leading-relaxed">System will trigger protocol alerts upon 85% threshold contact.</p>
                </div>
                <div className="pt-4">
                  <button
                    disabled={submitting}
                    type="submit"
                    className={`group relative overflow-hidden w-full py-4 rounded-2xl bg-accent-primary text-bg-main font-black uppercase tracking-widest shadow-xl shadow-accent-primary/20 transition-all active:scale-95 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
                        Synchronizing...
                      </div>
                    ) : (
                      editingBudget ? "Update Protocol" : "Apply Protocol"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* ── Delete Confirmation Modal ── */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bg-main/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-rose-500/20">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
                  <Trash2 size={28} className="text-rose-500" />
                </div>
                <h3 className="text-xl font-extrabold text-text-primary tracking-tight">Delete Budget</h3>
                <p className="text-sm text-text-secondary mt-2 font-medium opacity-70 leading-relaxed">
                  Are you sure you want to delete the{" "}
                  <span className="font-black text-text-primary">{confirmDelete}</span>{" "}
                  budget? This cannot be undone.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border-subtle mx-6" />

              {/* Actions */}
              <div className="flex gap-3 p-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-bg-elevated text-text-primary font-black text-sm uppercase tracking-widest border border-border-subtle hover:bg-bg-surface transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBudget}
                  className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-500/25 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    </>
  );
}
