import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import OptimizeModal from "./OptimizeModal";
import computeBudgetSuggestions from "../utils/budgetOptimizer";
import API from "../utils/api";
import { useToast } from "./ToastProvider";

export default function BudgetProgress({ budgets: propBudgets, analytics, transactions, monthlyBudget, fetchDashboardData, currentUser }) {
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { showToast } = useToast();
  const defaultBudgets = [
    { name: "Food", spent: 700, limit: 1000 },
    { name: "Transport", spent: 300, limit: 500 },
    { name: "Shopping", spent: 400, limit: 400 },
    { name: "Bills", spent: 180, limit: 200 },
  ];

  const budgets = propBudgets || defaultBudgets;
  const [localBudgets, setLocalBudgets] = useState(budgets);

  useEffect(() => {
    setLocalBudgets(budgets);
  }, [budgets]);

  const suggestions = computeBudgetSuggestions({ analytics, budgets: localBudgets, transactions, monthlyBudget });

  const handleApply = async (acceptedSuggestions) => {
    if (!acceptedSuggestions || acceptedSuggestions.length === 0) return;
    // Map to payload format
    const payload = acceptedSuggestions.map(s => ({ category: s.category, suggestedLimit: s.suggestedLimit }));
    try {
      setIsApplying(true);
      const userId = currentUser?.id ?? (typeof window !== 'undefined' ? (() => { const s = localStorage.getItem('bw_user'); return s ? JSON.parse(s).id : null; })() : null);
      if (!userId) {
        showToast('No user session found. Cannot apply suggestions.', { type: 'error' });
        setIsApplying(false);
        return;
      }
      await API.post('/budgets/optimize', { userId, suggestions: payload });
      // Refresh dashboard data if provided (call parent with userId)
      if (fetchDashboardData) await fetchDashboardData(userId);
      // Optimistically update local budgets immediately so UI reflects change
      setLocalBudgets(lb => lb.map(b => {
        const match = payload.find(p => String(p.category) === String(b.category));
        if (match) return { ...b, monthlyLimit: match.suggestedLimit };
        return b;
      }));
      showToast('Budget suggestions applied successfully.', { type: 'success' });
    } catch (err) {
      console.error('Apply failed', err);
      showToast('Failed to apply suggestions.', { type: 'error' });
    } finally {
      setIsApplying(false);
    }
  };

  const getPercentage = (spent, limit) => Math.min(Math.round((spent / limit) * 100), 100);

  const getStatusInfo = (percentage) => {
    if (percentage >= 100) return { 
      color: "bg-rose-500", 
      textColor: "text-rose-500",
      bgColor: "bg-rose-500/10",
      icon: <AlertCircle className="w-3 h-3 mr-1 text-rose-500" />,
      text: "Exceeded"
    };
    if (percentage >= 85) return { 
      color: "bg-amber-500", 
      textColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      icon: <AlertCircle className="w-3 h-3 mr-1 text-amber-500" />,
      text: "Peak Level" 
    };
    return { 
      color: "bg-emerald-500", 
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      icon: <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />,
      text: "Optimized" 
    };
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h3 className="text-xl font-extrabold text-text-primary tracking-tight">Active Limits</h3>
           <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Resource Allocation</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOptimizeOpen(true)} className="px-3 py-2 bg-bg-elevated text-text-secondary text-xs font-bold rounded-xl hover:bg-bg-elevated/80 hover:text-text-primary transition-all border border-border-subtle cursor-pointer">
            Quick Optimize
          </button>
          <Link href="/budgets" className="w-fit px-3 py-2 bg-bg-elevated text-text-secondary text-xs font-bold rounded-xl hover:bg-bg-elevated/80 hover:text-text-primary transition-all border border-border-subtle">
            Budget Overview
          </Link>
        </div>
      </div>
      <OptimizeModal open={isOptimizeOpen} onClose={() => setIsOptimizeOpen(false)} suggestions={suggestions} onApply={handleApply} />

      <div className="space-y-10">
        {localBudgets.map((budget, index) => {
          const name = budget.category || budget.name;
          const spent = budget.spentAmount || budget.spent || 0;
          const limit = budget.monthlyLimit || budget.limit || 1;
          const percentage = getPercentage(spent, limit);
          const status = getStatusInfo(percentage);

          return (
            <div key={index} className="group">
              <div className="flex justify-between items-end mb-4">
                <div>
                   <span className="text-xs font-extrabold text-text-secondary uppercase tracking-widest opacity-60">{name}</span>
                   <div className="flex items-center mt-1">
                      <span className="text-lg font-extrabold text-text-primary tracking-tight">${spent.toLocaleString()}</span>
                      <span className="text-xs text-text-secondary mx-2 font-bold opacity-30">/</span>
                      <span className="text-xs text-text-secondary font-bold opacity-60">${limit.toLocaleString()}</span>
                   </div>
                </div>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase transition-colors duration-300 ${status.bgColor} ${status.textColor} border border-transparent group-hover:border-current`}>
                  {status.icon}
                  {status.text}
                </div>
              </div>
              <div className="w-full bg-bg-elevated rounded-2xl h-3 mb-2 relative overflow-hidden group-hover:h-3.5 transition-all duration-300 shadow-inner">
                <div 
                  className={`h-full rounded-2xl ${status.color} transition-all duration-700 ease-out relative`} 
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  {percentage > 10 && (
                     <div className="absolute right-2 top-0 h-full flex items-center">
                        <div className="h-1 w-1 bg-white/50 rounded-full" />
                     </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end pr-1">
                <span className="text-[11px] font-extrabold text-text-secondary opacity-40 italic">{percentage}% consumed</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 p-6 rounded-[2rem] bg-bg-elevated/50 border border-border-subtle border-dashed text-center">
         <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest leading-relaxed opacity-40">Systematic monitoring of monthly thresholds via C++ Analytics Engine</p>
      </div>
    </div>
  );
}

