import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar, Tag, Trash2, Edit3, Copy } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function RecentTransactions({ transactions: propTransactions, onDelete, onEdit, onDuplicate }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const defaultTransactions = [
    { id: 1, date: "Oct 24, 2026", category: "Food", type: "Expense", amount: 120.50, status: "Completed", merchant: "Whole Foods Market" },
    { id: 2, date: "Oct 23, 2026", category: "Salary", type: "Income", amount: 4500.00, status: "Completed", merchant: "Tech Corp Inc." },
    { id: 3, date: "Oct 21, 2026", category: "Entertainment", type: "Expense", amount: 15.99, status: "Completed", merchant: "Netflix" },
    { id: 4, date: "Oct 20, 2026", category: "Shopping", type: "Expense", amount: 240.00, status: "Pending", merchant: "Amazon" },
    { id: 5, date: "Oct 19, 2026", category: "Transport", type: "Expense", amount: 45.00, status: "Completed", merchant: "Uber" },
    { id: 6, date: "Oct 18, 2026", category: "Freelance", type: "Income", amount: 850.00, status: "Completed", merchant: "Upwork Client" },
  ];

  const transactions = propTransactions || defaultTransactions;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="bg-bg-surface p-6 sm:p-8 rounded-[2.5rem] flex-1 overflow-hidden min-h-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-extrabold text-text-primary tracking-tight">Recent Activity</h3>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Transaction Ledger v1.0</p>
        </div>
        <Link href="/transactions" className="w-fit px-4 py-2 bg-bg-elevated text-text-secondary text-xs font-bold rounded-xl hover:bg-bg-elevated/80 hover:text-text-primary transition-all border border-border-subtle">
          Journal Overview
        </Link>
      </div>
      
      <div className="overflow-auto custom-scrollbar min-h-0 max-h-[36rem]">
        <table className="min-w-full">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-border-subtle">
              <th scope="col" className="px-4 py-4 text-left text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Description</th>
              <th scope="col" className="px-4 py-4 text-left text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Classification</th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Valuation</th>
              <th scope="col" className="px-4 py-4 text-center text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Protocol</th>
              <th scope="col" className="px-4 py-4 text-right text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-bg-elevated/30 transition-all duration-300">
                <td className="px-4 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-2xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-text-primary leading-tight group-hover:text-accent-primary transition-colors uppercase tracking-tight">
                        {tx.merchant || tx.category}
                      </p>
                      <div className="flex items-center mt-1 text-[10px] text-text-secondary font-bold space-x-3 capitalize opacity-60">
                        <span className="flex items-center"><Calendar size={10} className="mr-1 opacity-60" /> {tx.date.includes('T') ? tx.date.split('T')[0] : tx.date}</span>
                        <span className="sm:hidden flex items-center"><Tag size={10} className="mr-1 opacity-60" /> {tx.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="hidden sm:table-cell px-4 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-tight bg-bg-elevated text-text-secondary border border-border-subtle group-hover:bg-bg-surface transition-colors">
                    <Tag size={10} className="mr-1.5 text-text-secondary opacity-60" />
                    {tx.category}
                  </span>
                </td>
                
                <td className="px-4 py-5 whitespace-nowrap text-right">
                  <p className={`text-sm font-extrabold tracking-tight ${tx.type === 'Income' ? 'text-emerald-500' : 'text-text-primary'}`}>
                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </td>
                
                <td className="hidden sm:table-cell px-4 py-5 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-widest uppercase ${
                    (tx.status || 'Completed') === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {tx.status || 'Completed'}
                  </span>
                </td>
                
                <td className="px-4 py-5 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    onClick={() => toggleMenu(tx.id)}
                    className="p-2 text-text-secondary opacity-40 hover:text-text-primary hover:bg-bg-elevated rounded-xl shadow-none hover:shadow-sm transition-all active:scale-90"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === tx.id && (
                    <div 
                      ref={menuRef}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-48 bg-bg-surface rounded-2xl shadow-2xl border border-border-subtle z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <button 
                        onClick={() => {
                          if (onEdit) onEdit(tx);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-4 py-3 text-xs font-bold text-text-secondary hover:bg-bg-elevated hover:text-accent-primary rounded-xl transition-all group/opt"
                      >
                        <Edit3 size={14} className="mr-3 text-text-secondary opacity-40 group-hover/opt:text-accent-primary" />
                        Modify Record
                      </button>
                      <button 
                        onClick={() => {
                          if (onDuplicate) onDuplicate(tx);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-4 py-3 text-xs font-bold text-text-secondary hover:bg-bg-elevated hover:text-accent-primary rounded-xl transition-all group/opt"
                      >
                        <Copy size={14} className="mr-3 text-text-secondary opacity-40 group-hover/opt:text-accent-primary" />
                        Duplicate Entry
                      </button>
                      <div className="my-1 border-t border-border-subtle" />
                      <button 
                        onClick={() => {
                          if (onDelete) onDelete(tx.id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all group/opt"
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
    </div>
  );
}
