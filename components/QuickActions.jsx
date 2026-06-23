import { Plus, Minus, Settings2, FileBarChart2, Zap } from "lucide-react";

export default function QuickActions({ onAddIncome, onAddExpense, onSetBudget, onViewReports }) {
  return (
    <div className="bg-bg-surface p-8 rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle w-full group">
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-2 bg-accent-primary/10 rounded-xl">
           <Zap size={14} className="text-accent-primary" />
        </div>
        <h3 className="text-xl font-extrabold text-text-primary tracking-tight">Quick Access</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <button 
          onClick={onAddIncome}
          className="flex flex-col items-center justify-center bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 py-4 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 active:scale-95 group/btn"
        >
          <div className="p-2.5 bg-bg-surface rounded-2xl group-hover/btn:scale-110 group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-all duration-300 mb-3 text-emerald-600 shadow-sm">
            <Plus className="w-5 h-5 font-bold" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest">Income</span>
        </button>
        
        <button 
          onClick={onAddExpense}
          className="flex flex-col items-center justify-center bg-rose-500/10 text-rose-600 border border-rose-500/10 py-4 rounded-3xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 active:scale-95 group/btn"
        >
          <div className="p-2.5 bg-bg-surface rounded-2xl group-hover/btn:scale-110 group-hover/btn:bg-rose-500 group-hover/btn:text-white transition-all duration-300 mb-3 text-rose-600 shadow-sm">
            <Minus className="w-5 h-5 font-bold" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest">Expense</span>
        </button>
        
        <button 
          onClick={onSetBudget}
          className="flex flex-col items-center justify-center bg-accent-primary/10 text-accent-primary border border-accent-primary/10 py-4 rounded-3xl hover:bg-accent-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent-primary/10 active:scale-95 group/btn"
        >
          <div className="p-2.5 bg-bg-surface rounded-2xl group-hover/btn:scale-110 group-hover/btn:bg-accent-primary group-hover/btn:text-white transition-all duration-300 mb-3 text-accent-primary shadow-sm">
            <Settings2 className="w-5 h-5 font-bold" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest">Budget</span>
        </button>
        
        <button 
          onClick={onViewReports}
          className="flex flex-col items-center justify-center bg-bg-elevated text-text-secondary border border-border-subtle py-4 rounded-3xl hover:bg-text-primary hover:text-bg-main transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-text-primary/10 active:scale-95 group/btn"
        >
          <div className="p-2.5 bg-bg-surface rounded-2xl group-hover/btn:scale-110 group-hover/btn:bg-text-primary group-hover/btn:text-bg-main transition-all duration-300 mb-3 text-text-secondary shadow-sm">
            <FileBarChart2 className="w-5 h-5 font-bold" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest">Reports</span>
        </button>
      </div>
    </div>
  );
}
