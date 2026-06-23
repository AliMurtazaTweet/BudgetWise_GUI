import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/api";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus, 
  MoreHorizontal,
  Coffee, 
  Car,
  ShoppingBag,
  Receipt,
  Briefcase,
  Box,
  X,
  TrendingDown,
  TrendingUp,
  Search,
  Trash2,
  Edit3,
  Copy,
  ChevronDown,
  Check,
  User,
  Building,
  Home,
  Sparkles,
  Coins,
  Gift,
  RotateCcw,
  DollarSign,
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
  Smile,
  Layers
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
  { value: "Bills", label: "Bills", icon: Receipt, color: "text-sky-500", bgColor: "bg-sky-500/10" },
  { value: "Transport", label: "Transport", icon: Car, color: "text-blue-500", bgColor: "bg-blue-500/10" },
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

const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All Categories", icon: null, color: "text-text-secondary", bgColor: "bg-bg-elevated/60" },
  ...[
    ...EXPENSE_CATEGORIES,
    ...INCOME_CATEGORIES
  ].reduce((unique, item) => {
    if (!unique.some((option) => option.value === item.value)) {
      unique.push(item);
    }
    return unique;
  }, [])
];

const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "month", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
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

export default function Transactions() {
  const router = useRouter();
  const { q } = router.query;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("Expense");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Food & Dining");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("30");
  const [isCategoryFilterDropdownOpen, setIsCategoryFilterDropdownOpen] = useState(false);
  const [isDateFilterDropdownOpen, setIsDateFilterDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to delete
  const menuRef = useRef(null);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && menuRef.current.contains(event.target)) ||
        (filterMenuRef.current && filterMenuRef.current.contains(event.target))
      ) {
        return;
      }
      setOpenMenuId(null);
      setIsCategoryFilterDropdownOpen(false);
      setIsDateFilterDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (q) setSearchTerm(q);
  }, [q]);

  const fetchTransactions = async (userId) => {
    try {
      setLoading(true);
      const response = await API.get(`/transactions?userId=${userId}`);
      // Sort by latest date first, fallback to ID for same timestamp
      const sorted = response.data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return b.id - a.id;
      });
      setTransactions(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auth guard: redirect to login if no session exists
    const savedUser = localStorage.getItem("bw_user");
    if (!savedUser) {
      router.replace("/login");
      return;
    }
    fetchTransactions(JSON.parse(savedUser).id);
  }, []);


  const isInDateRange = (dateValue, filter) => {
    if (filter === "all") return true;
    const txDate = new Date(dateValue);
    if (Number.isNaN(txDate.getTime())) return false;
    const now = new Date();
    if (filter === "month") {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (filter === "lastMonth") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
    }
    const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);
    return diffDays <= Number(filter);
  };

  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase();
    if (selectedCategoryFilter !== "all" && tx.category !== selectedCategoryFilter) return false;
    if (!isInDateRange(tx.date, selectedDateFilter)) return false;
    return (
      tx.merchant?.toLowerCase().includes(searchLower) ||
      tx.category?.toLowerCase().includes(searchLower)
    );
  });

  const openModal = (type) => {
    setModalType(type);
    setSelectedCategory(type === "Income" ? "Salary" : "Food & Dining");
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    
    const savedUser = localStorage.getItem("bw_user");
    const userId = savedUser ? JSON.parse(savedUser).id : 1;

    const payload = {
      userId: userId,
      merchant: formData.get("merchant"),
      amount: parseFloat(formData.get("amount")),
      category: formData.get("category"),
      type: modalType,
      date: new Date().toISOString() // Full ISO timestamp for precise sorting
    };

    try {
      if (editingTransaction) {
        await API.post("/transaction/update", {
          ...payload,
          transactionId: editingTransaction.id,
          merchant: payload.merchant // Ensuring merchant is explicitly passed for backend
        });
      } else {
        await API.post("/transaction", payload);
      }
      const savedUserRefresh = localStorage.getItem("bw_user");
      if (savedUserRefresh) await fetchTransactions(JSON.parse(savedUserRefresh).id);
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert("Failed to save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setModalType(tx.type);
    setSelectedCategory(tx.category);
    setIsCategoryDropdownOpen(false);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const handleDuplicateTransaction = async (tx) => {
    setSubmitting(true);
    
    const savedUser = localStorage.getItem("bw_user");
    const userId = savedUser ? JSON.parse(savedUser).id : 1;

    const payload = {
      userId: userId,
      merchant: tx.merchant || tx.category,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
      date: new Date().toISOString()
    };
    try {
      await API.post("/transaction", payload);
      const savedUserDup = localStorage.getItem("bw_user");
      if (savedUserDup) await fetchTransactions(JSON.parse(savedUserDup).id);
      setOpenMenuId(null);
    } catch (err) {
      console.error("Duplicate failed:", err);
      alert("Failed to duplicate entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setDeleteConfirm(id);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try {
      await API.post("/transaction/delete", { transactionId: id });
      const savedUserDel = localStorage.getItem("bw_user");
      if (savedUserDel) await fetchTransactions(JSON.parse(savedUserDel).id);
    } catch (err) {
      console.error("Delete failed:", err);
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
        <title>Transactions | BudgetWise</title>
      </Head>
      <DashboardLayout>
        {/* ── Custom Delete Confirmation Modal ─────────────────────────── */}
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

        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Transactions</h1>
            <p className="text-sm sm:text-base text-text-secondary mt-1 font-medium opacity-60">Live data from C++ Backend.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => openModal("Expense")}
              className="flex items-center px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/10 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Minus size={16} className="mr-1.5" />
              Add Expense
            </button>
            <button 
              onClick={() => openModal("Income")}
              className="flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} className="mr-1.5" />
              Add Income
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-bg-surface p-4 rounded-2xl border border-border-subtle shadow-xl shadow-text-primary/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-40 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 text-text-primary bg-bg-elevated/50 font-bold placeholder-text-secondary/40"
              />
           </div>
           <div className="flex flex-wrap items-center gap-3" ref={filterMenuRef}>
              <div className="relative min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryFilterDropdownOpen((open) => !open);
                    setIsDateFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border-subtle bg-bg-elevated/70 text-sm font-bold text-text-primary hover:border-accent-primary transition-all"
                >
                  <span className="flex items-center gap-2">
                    {selectedCategoryFilter === "all" ? (
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-bg-main text-text-secondary">
                        <Layers size={16} />
                      </span>
                    ) : (() => {
                      const selectedOption = CATEGORY_FILTER_OPTIONS.find((option) => option.value === selectedCategoryFilter);
                      const IconComponent = selectedOption?.icon;
                      return (
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl ${selectedOption?.bgColor || 'bg-bg-main'} ${selectedOption?.color || 'text-text-primary'}`}>
                          {IconComponent ? <IconComponent size={16} /> : <Box size={16} />}
                        </span>
                      );
                    })()}
                    <span>{CATEGORY_FILTER_OPTIONS.find((option) => option.value === selectedCategoryFilter)?.label || 'All Categories'}</span>
                  </span>
                  <ChevronDown size={18} className={`text-text-secondary transition-transform ${isCategoryFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryFilterDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl overflow-hidden z-50">
                    {CATEGORY_FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryFilter(option.value);
                          setIsCategoryFilterDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-all ${selectedCategoryFilter === option.value ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-primary hover:bg-bg-elevated'}`}
                      >
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-2xl ${option.bgColor || 'bg-bg-main'} ${option.color || 'text-text-primary'}`}>
                          {option.icon ? <option.icon size={16} /> : <Box size={16} />}
                        </span>
                        <span>{option.label}</span>
                        {selectedCategoryFilter === option.value && <Check size={16} className="ml-auto text-accent-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsDateFilterDropdownOpen((open) => !open);
                    setIsCategoryFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-border-subtle bg-bg-elevated/70 text-sm font-bold text-text-primary hover:border-accent-primary transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent-primary" />
                    {DATE_FILTER_OPTIONS.find((range) => range.value === selectedDateFilter)?.label || 'Last 30 Days'}
                  </span>
                  <ChevronDown size={18} className={`text-text-secondary transition-transform ${isDateFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDateFilterDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl overflow-hidden z-50">
                    {DATE_FILTER_OPTIONS.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => {
                          setSelectedDateFilter(range.value);
                          setIsDateFilterDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-bold transition-all ${selectedDateFilter === range.value ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-primary hover:bg-bg-elevated'}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Transactions Table/List */}
        <div className="bg-bg-surface rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle overflow-hidden min-h-[400px]">
          {error ? (
            <div className="p-20 text-center">
              <TrendingDown className="mx-auto h-12 w-12 text-rose-500 mb-4 opacity-50" />
              <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{error}</h3>
              <p className="text-text-secondary mt-2 text-sm opacity-60">Make sure your C++ server is listening on port 8080.</p>
              <button 
                onClick={fetchTransactions}
                className="mt-8 px-8 py-3 bg-accent-primary text-bg-main rounded-xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 shadow-xl shadow-accent-primary/20 active:scale-95 transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-20 text-center">
              <Box className="mx-auto h-12 w-12 text-text-secondary mb-4 opacity-20" />
              <h3 className="text-lg font-extrabold text-text-primary uppercase tracking-widest opacity-60">No transactions yet</h3>
              <p className="text-text-secondary mt-2 text-sm opacity-40">Add your first income or expense to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-visible">
              <table className="min-w-full divide-y divide-border-subtle">
                <thead className="bg-bg-elevated/30 hidden sm:table-header-group">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Transaction</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Date</th>
                    <th scope="col" className="px-6 py-4 text-right text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Amount</th>
                    <th scope="col" className="px-6 py-4 text-center text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Protocol</th>
                    <th scope="col" className="px-6 py-4 text-right text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60"></th>
                  </tr>
                </thead>
                <tbody className="bg-bg-surface divide-y divide-border-subtle">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-bg-elevated/30 transition-all duration-300 group">
                      <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2.5 rounded-xl mr-3 shadow-sm transition-transform duration-300 group-hover:scale-110 ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-text-primary tracking-tight transition-colors group-hover:text-accent-primary uppercase">{tx.merchant || tx.category}</p>
                            <p className="text-[10px] text-text-secondary sm:hidden flex items-center mt-1 font-bold opacity-60">
                              <span className="mr-1 opacity-60">{getCategoryIcon(tx.category)}</span>
                              {tx.category} • {tx.date}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="hidden sm:table-cell px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2 bg-bg-elevated/50 p-1.5 rounded-lg border border-border-subtle group-hover:bg-bg-surface transition-colors">
                            {getCategoryIcon(tx.category)}
                          </div>
                          <span className="text-sm font-bold text-text-secondary opacity-80 uppercase tracking-tight">{tx.category}</span>
                        </div>
                      </td>
                      
                      <td className="hidden sm:table-cell px-6 py-5 whitespace-nowrap text-xs font-bold text-text-secondary opacity-60">
                        {tx.date.includes('T') ? tx.date.split('T')[0] : tx.date}
                      </td>
                      
                      <td className="px-4 sm:px-6 py-5 whitespace-nowrap text-right">
                        <p className={`text-sm font-black tracking-tight ${tx.type === 'Income' ? 'text-emerald-500' : 'text-text-primary'}`}>
                          {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-text-secondary sm:hidden mt-0.5 font-bold opacity-40 uppercase tracking-widest">{tx.status || 'Completed'}</p>
                      </td>
                      
                      <td className="hidden sm:table-cell px-6 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          (tx.status || 'Completed') === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {tx.status || 'Completed'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium relative overflow-visible">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                          className="p-2 text-text-secondary opacity-30 hover:opacity-100 hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-all active:scale-90"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {openMenuId === tx.id && (
                          <div 
                            ref={menuRef}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute right-6 mt-1 w-48 bg-bg-surface rounded-2xl shadow-2xl border border-border-subtle z-[100] p-2 animate-in fade-in slide-in-from-top-1 duration-200"
                          >
                            <button 
                              onClick={() => handleEditClick(tx)}
                              className="flex items-center w-full px-4 py-3 text-xs font-extrabold text-text-secondary hover:bg-bg-elevated hover:text-accent-primary rounded-xl transition-all group/opt"
                            >
                              <Edit3 size={14} className="mr-3 text-text-secondary opacity-40 group-hover/opt:text-accent-primary" />
                              Modify Record
                            </button>
                            <button 
                              onClick={() => handleDuplicateTransaction(tx)}
                              className="flex items-center w-full px-4 py-3 text-xs font-extrabold text-text-secondary hover:bg-bg-elevated hover:text-accent-primary rounded-xl transition-all group/opt"
                            >
                              <Copy size={14} className="mr-3 text-text-secondary opacity-40 group-hover/opt:text-accent-primary" />
                              Duplicate Entry
                            </button>
                            <div className="my-1 border-t border-border-subtle" />
                            <button 
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="flex items-center w-full px-4 py-3 text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all group/opt"
                            >
                              <Trash2 size={14} className="mr-3 text-rose-500 opacity-60 group-hover/opt:text-rose-500" />
                              Remove Permanent
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-border-subtle">
              <div className="flex justify-between items-center px-8 py-7 bg-bg-elevated/30 border-b border-border-subtle">
                <div>
                   <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{editingTransaction ? 'Modify' : 'Initialize'} {modalType}</h3>
                   <p className="text-[11px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Ledger Record Protocol</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingTransaction(null); }} className="p-2 bg-bg-surface rounded-xl text-text-secondary hover:text-text-primary shadow-sm hover:shadow transition-all active:scale-95">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-8 space-y-6">
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
                <div className="pt-4">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className={`group relative overflow-hidden w-full py-4 rounded-2xl text-bg-main font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                      modalType === "Income" ? "bg-emerald-600 shadow-emerald-500/20" : "bg-rose-600 shadow-rose-500/20"
                    } ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
                        Saving...
                      </div>
                    ) : (
                      editingTransaction ? `Update Record` : `Secure Entry`
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
