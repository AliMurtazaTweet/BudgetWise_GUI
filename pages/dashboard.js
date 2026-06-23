import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCards from "../components/SummaryCards";
import ExpensePieChart from "../components/ExpensePieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import BudgetProgress from "../components/BudgetProgress";
import QuickActions from "../components/QuickActions";
import RecentTransactions from "../components/RecentTransactions";
import InsightsTimeline from "../components/InsightsTimeline";
import API from "../utils/api";
import { buildInsights } from "../utils/insights";
import { 
  Wallet, 
  TrendingDown, 
  PiggyBank, 
  Target, 
  X,
  Trash2,
  Download,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  ArrowDownRight,
  ChevronDown,
  Check,
  Briefcase,
  User,
  Building,
  Home,
  Sparkles,
  Coins,
  Gift,
  RotateCcw,
  DollarSign,
  Coffee,
  Car,
  ShoppingBag,
  Receipt,
  Box,
  Utensils,
  Film,
  HeartPulse,
  Lightbulb,
  GraduationCap,
  Plane,
  Calendar,
  Shield,
  FileText,
  HelpCircle,
  Smile
} from "lucide-react";
const INCOME_CATEGORIES = [
  { value: "Salary", label: "Salary", icon: Briefcase, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { value: "Freelance", label: "Freelance", icon: User, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { value: "Investments", label: "Investments", icon: TrendingUp, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  { value: "Business", label: "Business", icon: Building, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  { value: "Rental Income", label: "Rental Income", icon: Home, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { value: "Side Hustle", label: "Side Hustle", icon: Sparkles, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { value: "Bonus", label: "Bonus", icon: Coins, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  { value: "Gifts", label: "Gifts", icon: Gift, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  { value: "Refunds", label: "Refunds", icon: RotateCcw, color: "text-teal-500", bgColor: "bg-teal-500/10" },
  { value: "Other Income", label: "Other Income", icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-500/10" }
];

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

const getCategoryIcon = (category) => {
  switch(category) {
    case "Food":
    case "Food & Dining": return <Utensils size={16} className="text-orange-500" />;
    case "Transport":
    case "Transportation": return <Car size={16} className="text-blue-500" />;
    case "Shopping": return <ShoppingBag size={16} className="text-purple-500" />;
    case "Bills":
    case "Utilities": return <Lightbulb size={16} className="text-yellow-500" />;
    case "Entertainment": return <Film size={16} className="text-pink-500" />;
    case "Health & Fitness": return <HeartPulse size={16} className="text-rose-500" />;
    case "Housing & Rent": return <Home size={16} className="text-amber-500" />;
    case "Education": return <GraduationCap size={16} className="text-indigo-500" />;
    case "Personal Care": return <Smile size={16} className="text-teal-500" />;
    case "Travel": return <Plane size={16} className="text-sky-500" />;
    case "Subscriptions": return <Calendar size={16} className="text-violet-500" />;
    case "Gifts & Donations": return <Gift size={16} className="text-red-500" />;
    case "Insurance": return <Shield size={16} className="text-blue-600" />;
    case "Taxes": return <FileText size={16} className="text-slate-500" />;
    case "Miscellaneous": return <HelpCircle size={16} className="text-gray-500" />;
    
    // Income
    case "Salary": return <Briefcase size={16} className="text-emerald-500" />;
    case "Freelance": return <User size={16} className="text-blue-500" />;
    case "Investments": return <TrendingUp size={16} className="text-indigo-500" />;
    case "Business": return <Building size={16} className="text-violet-500" />;
    case "Rental Income": return <Home size={16} className="text-amber-500" />;
    case "Side Hustle": return <Sparkles size={16} className="text-pink-500" />;
    case "Bonus": return <Coins size={16} className="text-yellow-500" />;
    case "Gifts": return <Gift size={16} className="text-rose-500" />;
    case "Refunds": return <RotateCcw size={16} className="text-teal-500" />;
    case "Other Income": return <DollarSign size={16} className="text-emerald-500" />;
    default: return <Box size={16} className="text-gray-500" />;
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null); // Renamed from 'data'
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Quick Add Modal State
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("Expense");
  const [submitting, setSubmitting] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Food & Dining");
  // Monthly budget from user preferences
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [insights, setInsights] = useState([]);

  const fetchDashboardData = useCallback(async (userId) => {
    try {
      const [analyticsRes, transactionsRes, budgetsRes] = await Promise.all([
        API.get(`/analytics?userId=${userId}`),
        API.get(`/transactions?userId=${userId}`),
        API.get(`/budgets?userId=${userId}`)
      ]);
      
      setAnalytics(analyticsRes.data);
      const sortedTransactions = transactionsRes.data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return b.id - a.id;
      });
      setTransactions(sortedTransactions.slice(0, 6));
      
      const breakdown = analyticsRes.data.breakdown || {};
      const enrichedBudgets = budgetsRes.data.map(b => ({
        ...b,
        spentAmount: breakdown[b.category] || 0
      }));
      setBudgets(enrichedBudgets);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Auth guard: redirect to login if no session exists
    const savedUser = localStorage.getItem("bw_user");
    if (!savedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(savedUser);
    setCurrentUser(user);
    // Load monthly budget from preferences
    try {
      const prefs = user.preferences
        ? (typeof user.preferences === "string" ? JSON.parse(user.preferences) : user.preferences)
        : {};
      setMonthlyBudget(prefs.monthlyBudget || 0);
    } catch {}
    // Fetch all dashboard data using the authenticated user's ID
    fetchDashboardData(user.id);
  }, [fetchDashboardData, router]);

  useEffect(() => {
    const onQuickAdd = (e) => {
      const type = e?.detail?.type;
      if (type === "Income" || type === "Expense") handleQuickAdd(type);
    };
    window.addEventListener("bw:quickAdd", onQuickAdd);
    return () => window.removeEventListener("bw:quickAdd", onQuickAdd);
  }, []);

  useEffect(() => {
    const qa = router.query?.qa;
    if (qa === "Income" || qa === "Expense") {
      handleQuickAdd(qa);
      const nextQuery = { ...router.query };
      delete nextQuery.qa;
      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    setInsights(
      buildInsights({
        analytics,
        transactions,
        monthlyBudget
      })
    );
  }, [analytics, monthlyBudget, transactions]);

  const handleExportData = async () => {
    try {
      // Fetch all transactions for export
      const userId = currentUser?.id || 1;
      const response = await API.get(`/transactions?userId=${userId}`);
      const allTransactions = response.data;
      
      if (allTransactions.length === 0) {
        alert("No transaction data available to export.");
        return;
      }

      // Convert to CSV
      const headers = ["ID", "Date", "Category", "Type", "Amount", "Merchant"];
      const formatCSVDate = (dateString) => {
        try {
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return dateString;
          const yyyy = d.getFullYear();
          const MM = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          let hours = d.getHours();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          const hh = String(hours).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          const ss = String(d.getSeconds()).padStart(2, '0');
          return `${yyyy}-${MM}-${dd} - ${hh}:${mm}:${ss} ${ampm}`;
        } catch {
          return dateString;
        }
      };

      const csvRows = [
        headers.join(","),
        ...allTransactions.map(t => 
          [t.id, `"${formatCSVDate(t.date)}"`, t.category, t.type, t.amount, `"${t.merchant || t.category}"`].join(",")
        )
      ];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      
      // Trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `BudgetWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleNewReport = () => {
    router.push("/reports");
  };

  const handleQuickAdd = (type) => {
    setEditingTransaction(null); // Ensure no transaction is being edited when opening for new
    setModalType(type);
    setSelectedCategory(type === "Income" ? "Salary" : "Food & Dining");
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    const userId = currentUser?.id || 1;
    try {
      await API.post("/transaction/delete", { transactionId: id, userId });
      await fetchDashboardData(currentUser?.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setModalType(tx.type);
    setSelectedCategory(tx.category);
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleDuplicateTransaction = async (tx) => {
    setSubmitting(true);
    const payload = {
      userId: currentUser?.id || 1,
      merchant: tx.merchant || tx.category,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
      date: new Date().toISOString()
    };
    try {
      await API.post("/transaction", payload);
      await fetchDashboardData();
    } catch (err) {
      console.error("Duplicate failed:", err);
      alert("Failed to duplicate entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    
    const payload = {
      userId: currentUser?.id || 1,
      merchant: formData.get("merchant"),
      amount: parseFloat(formData.get("amount")),
      category: formData.get("category"),
      type: modalType,
      date: new Date().toISOString()
    };

    try {
      if (editingTransaction) {
        await API.post("/transaction/update", {
          ...payload,
          transactionId: editingTransaction.id,
          merchant: payload.merchant // Enforce payload to not miss entity/description
        });
      } else {
        await API.post("/transaction", payload);
      }
      await fetchDashboardData(currentUser?.id);
      setIsModalOpen(false);
      setEditingTransaction(null); // Clear editing state
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-bg-elevated" />
            <div className="absolute inset-0 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
          </div>
          <p className="mt-4 text-text-secondary font-bold animate-pulse uppercase tracking-[0.2em] text-[11px] opacity-60">Synchronizing Financial Data</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-bg-surface p-8 rounded-[2rem] shadow-2xl shadow-rose-500/10 border border-rose-500/10 max-w-md text-center">
            <div className="h-20 w-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-xl font-extrabold text-text-primary mb-2">Backend Connection Lost</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-text-primary text-bg-main rounded-2xl font-bold shadow-xl shadow-text-primary/10 hover:bg-opacity-90 transition-all active:scale-95"
            >
              Attempt Reconnection
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const analyticsCards = [
    {
      title: "Active Balance",
      amount: `$${(analytics.income - analytics.expense).toLocaleString()}`,
      trend: "Total Net Worth",
      isPositive: true,
      icon: Wallet,
      color: "text-accent-primary",
      bgColor: "bg-accent-primary/10",
    },
    {
      title: "Monthly Revenue",
      amount: `$${analytics.income.toLocaleString()}`,
      trend: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Outflow",
      amount: `$${analytics.expense.toLocaleString()}`,
      trend: "-4.2%",
      isPositive: false,
      icon: TrendingDown,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Savings Rate",
      amount: `${Math.round((analytics.savings / analytics.income) * 100 || 0)}%`,
      trend: "+2.4% vs last mo",
      isPositive: true,
      icon: PiggyBank,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  // Dynamic expenses computation
  const sortedBreakdown = Object.entries(analytics?.breakdown || {})
    .filter(([, val]) => val > 0)
    .sort(([, a], [, b]) => b - a);
    
  let pieLabels = [];
  let pieData = [];
  
  if (sortedBreakdown.length <= 5) {
    pieLabels = sortedBreakdown.map(([k]) => k);
    pieData = sortedBreakdown.map(([, v]) => v);
  } else {
    pieLabels = sortedBreakdown.slice(0, 4).map(([k]) => k);
    pieData = sortedBreakdown.slice(0, 4).map(([, v]) => v);
    const otherSum = sortedBreakdown.slice(4).reduce((acc, [, v]) => acc + v, 0);
    pieLabels.push('Other');
    pieData.push(otherSum);
  }

  // Fallback if no expenses
  if (pieLabels.length === 0) {
    pieLabels = ['No Expenses'];
    pieData = [1];
  }

  const todayMonth = new Date().toLocaleString('default', { month: 'short' });
  const monthlyData = [
    { month: "Jan", income: analytics.income * 0.9, expense: analytics.expense * 0.8 },
    { month: "Feb", income: analytics.income * 0.85, expense: analytics.expense * 0.85 },
    { month: "Mar", income: analytics.income * 0.95, expense: analytics.expense * 1.1 },
    { month: "Apr", income: analytics.income * 1.05, expense: analytics.expense * 0.9 },
    { month: "May", income: analytics.income * 1.1, expense: analytics.expense * 0.95 },
    { month: todayMonth, income: analytics.income, expense: analytics.expense },
  ];

  return (
    <>
      <Head>
        <title>Wealth Dashboard | BudgetWise</title>
      </Head>
      <DashboardLayout>
        {/* Header Section */}
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-accent-primary mb-2">
              <PlusCircle size={16} />
              <span className="text-[11px] font-extrabold uppercase tracking-widest">Real-time Financial Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">Financial Overview</h1>
            <p className="text-text-secondary mt-2 font-medium">Monitoring <span className="text-text-primary font-bold">{transactions.length}+</span> active movements in your account.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExportData}
              className="flex items-center space-x-2 px-5 py-3.5 bg-bg-surface border border-border-subtle text-text-primary rounded-2xl text-sm font-bold hover:bg-bg-elevated transition-all shadow-sm active:scale-95 group"
            >
              <Download size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
              <span>Statement</span>
            </button>
            <button 
              onClick={handleNewReport}
              className="flex items-center space-x-2 px-6 py-3.5 bg-accent-primary text-bg-main rounded-2xl text-sm font-bold hover:bg-opacity-90 hover:shadow-xl hover:shadow-accent-primary/20 transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              <span>Generate Analysis</span>
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="mb-10">
          <SummaryCards cards={analyticsCards} />
        </div>

        {/* Monthly Budget Overview Banner */}
        {monthlyBudget > 0 && analytics && (() => {
          const totalSpent = analytics.expense || 0;
          const pct = Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100);
          const remaining = Math.max(monthlyBudget - totalSpent, 0);
          const isOver = totalSpent > monthlyBudget;
          const isWarn = !isOver && pct >= 80;
          const statusColor = isOver ? "text-rose-500" : isWarn ? "text-amber-500" : "text-emerald-500";
          const barColor = isOver ? "bg-rose-500" : isWarn ? "bg-amber-500" : "bg-emerald-500";
          const statusLabel = isOver ? "Over Budget" : isWarn ? "Near Limit" : "On Track";
          const statusBg = isOver ? "bg-rose-500/10 text-rose-500" : isWarn ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500";
          const circumference = 2 * Math.PI * 34;
          const dashOffset = circumference - (pct / 100) * circumference;
          return (
            <div className="mb-8 bg-bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row items-stretch gap-0">
                {/* Left side – info */}
                <div className="flex-1 p-7 lg:p-9">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-accent-primary/10 rounded-2xl">
                      <Target className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Monthly Budget Overview</p>
                      <p className="text-[11px] font-bold text-text-secondary opacity-40">{new Date().toLocaleString('default',{month:'long',year:'numeric'})}</p>
                    </div>
                    <span className={`ml-auto text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusBg}`}>{statusLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-subtle">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-1">Budget</p>
                      <p className="text-xl font-black text-text-primary">${monthlyBudget.toLocaleString()}</p>
                    </div>
                    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-subtle">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-1">Spent</p>
                      <p className="text-xl font-black text-rose-500">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-subtle">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-1">Remaining</p>
                      <p className={`text-xl font-black ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isOver ? `-$${(totalSpent - monthlyBudget).toLocaleString()}` : `$${remaining.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="w-full bg-bg-elevated rounded-full h-2.5 overflow-hidden border border-border-subtle">
                      <div className={`h-2.5 rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-[10px] font-bold text-text-secondary opacity-40">{pct}% of monthly limit used</p>
                      <Link href="/budgets" className="text-xs font-black text-accent-primary hover:underline">Manage Budgets →</Link>
                    </div>
                  </div>
                </div>
                {/* Right side – radial ring */}
                <div className="flex flex-col items-center justify-center px-8 py-7 lg:border-l border-border-subtle gap-3">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-bg-elevated" strokeWidth="8" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className={statusColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xl font-black ${statusColor}`}>{pct}%</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-wider text-center">of monthly<br/>budget used</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Main Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 flex flex-col h-full min-h-[480px]">
            <MonthlyLineChart chartData={monthlyData} />
          </div>
          <div className="flex flex-col h-full min-h-[480px]">
            <ExpensePieChart chartData={pieData} labels={pieLabels} />
          </div>
        </div>

        {/* Quick Access + Active Limits */}
        <div className="grid grid-cols-1 gap-8 pb-10 items-start">
          <div className="flex flex-col gap-8 min-h-0">
            <div className="bg-bg-surface p-6 rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex-1 min-h-0">
              <QuickActions 
                onAddIncome={() => handleQuickAdd("Income")}
                onAddExpense={() => handleQuickAdd("Expense")}
                onSetBudget={() => router.push("/budgets")}
                onViewReports={() => router.push("/reports")}
              />
            </div>
            <div className="bg-bg-surface p-8 rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex-1 min-h-0">
              <BudgetProgress 
                budgets={budgets} 
                analytics={analytics}
                transactions={transactions}
                monthlyBudget={monthlyBudget}
                fetchDashboardData={fetchDashboardData}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-bg-surface p-2 rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle transition-all hover:shadow-2xl hover:shadow-accent-primary/5 hover:-translate-y-1 overflow-hidden flex flex-col min-h-0 mb-10">
          <RecentTransactions 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onEdit={handleEditClick}
            onDuplicate={handleDuplicateTransaction}
          />
        </div>

        {/* Insights Timeline */}
        <div className="mb-10">
          <InsightsTimeline insights={insights} />
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-bg-surface rounded-[2rem] shadow-2xl w-full max-w-sm border border-rose-500/20 p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 mx-auto mb-5">
                <Trash2 size={24} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-extrabold text-text-primary tracking-tight text-center">Delete Record?</h3>
              <p className="text-sm text-text-secondary text-center mt-2 opacity-70">This action is permanent and cannot be undone.</p>
              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl bg-bg-elevated border border-border-subtle text-text-primary font-bold text-sm hover:bg-bg-main transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-2xl bg-rose-500 text-white font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-text-primary/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-border-subtle">
              <div className="flex justify-between items-center px-8 py-7 bg-bg-elevated/50 border-b border-border-subtle">
                <div>
                   <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{editingTransaction ? 'Modify' : 'Initialize'} {modalType}</h3>
                   <p className="text-[11px] text-text-secondary font-bold uppercase tracking-widest mt-1">CORE LEDGER ENTRY</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingTransaction(null); }} className="p-2 bg-bg-surface rounded-xl text-text-secondary hover:text-text-primary shadow-sm hover:shadow transition-all active:scale-95">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-8 space-y-5">
                <div className="space-y-2 relative">
                  <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Tag / Category</label>
                  
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
                      {(modalType === "Income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.value);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                              selectedCategory === cat.value
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
                  <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Entity / Description</label>
                  <input 
                    name="merchant"
                    type="text" 
                    required
                    defaultValue={editingTransaction?.merchant || ""}
                    className="w-full px-5 py-4 bg-bg-elevated border-none rounded-2xl focus:ring-4 focus:ring-accent-primary/10 focus:bg-bg-surface text-text-primary font-bold placeholder-text-secondary transition-all outline-none"
                    placeholder="e.g., Apple Store"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Amount ($)</label>
                  <input 
                    name="amount"
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editingTransaction?.amount || ""}
                    className="w-full px-5 py-4 bg-bg-elevated border-none rounded-2xl focus:ring-4 focus:ring-accent-primary/10 focus:bg-bg-surface text-text-primary font-bold placeholder-text-secondary transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="pt-6">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className={`group relative overflow-hidden w-full py-4 rounded-2xl text-bg-main font-extrabold shadow-xl transition-all active:scale-95 ${
                      modalType === "Income" 
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" 
                        : "bg-accent-primary hover:bg-opacity-90 shadow-accent-primary/20"
                    }`}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {editingTransaction ? (
                          "Update Record"
                        ) : (
                          <>
                            {modalType === "Income" ? <ArrowUpRight className="mr-2" size={20} /> : <ArrowDownRight className="mr-2" size={20} />}
                            Secure Transaction
                          </>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
