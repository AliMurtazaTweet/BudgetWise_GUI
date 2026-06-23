import DashboardLayout from "../components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Zap, CreditCard, ChevronRight, Filter, Calendar } from "lucide-react";
import { useState } from "react";

const allNotifications = [
  { id: 1, title: "Budget Limit Contact", body: "Operational threshold contact: 85% of Food budget consumed.", time: "10 mins ago", color: "text-amber-500", bg: "bg-amber-500/10", type: "budget", icon: Zap },
  { id: 2, title: "Inbound Transaction", body: "$14.50 processed at Starbucks Protocol.", time: "1 hour ago", color: "text-accent-primary", bg: "bg-accent-primary/10", type: "transaction", icon: CreditCard },
  { id: 3, title: "Neural Sync Update", body: "We've upgraded the predictive analysis core for improved forecasting.", time: "4 hours ago", color: "text-emerald-500", bg: "bg-emerald-500/10", type: "system", icon: Bell },
  { id: 4, title: "Ledger Reset", body: "Monthly budget bound for 'Entertainment' has been re-initialized.", time: "Yesterday", color: "text-text-secondary", bg: "bg-bg-elevated", type: "budget", icon: Zap },
  { id: 5, title: "Anomalous Outbound", body: "Large purchase of $450.00 detected at Best Buy node.", time: "2 days ago", color: "text-rose-500", bg: "bg-rose-500/10", type: "transaction", icon: CreditCard },
];

export default function NotificationsCenter() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" 
    ? allNotifications 
    : allNotifications.filter(n => n.type === filter);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-text-primary tracking-tighter flex items-center italic">
              ALERT <span className="text-accent-primary ml-3 not-italic">COMMAND</span>
            </h1>
            <p className="text-[11px] text-text-secondary font-black tracking-widest uppercase mt-3 opacity-60">Strategic Log of Financial Operations & Neural Insights.</p>
          </motion.div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {["all", "budget", "transaction", "system"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? "bg-text-primary text-bg-main shadow-xl shadow-text-primary/10" 
                    : "bg-bg-surface text-text-secondary opacity-40 hover:opacity-100 hover:bg-bg-elevated border border-border-subtle"
                }`}
              >
                {f === "all" ? "Protocol All" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((n, index) => {
            const Icon = n.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="group relative bg-bg-surface rounded-3xl p-7 border border-border-subtle shadow-xl shadow-text-primary/5 hover:shadow-2xl hover:shadow-accent-primary/10 hover:border-accent-primary/30 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start space-x-8">
                  <div className={`p-5 rounded-2xl ${n.bg} ${n.color} transition-all duration-500 group-hover:rotate-6 shadow-sm border border-current/10`}>
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors uppercase italic">{n.title}</h3>
                      <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center opacity-40">
                        <Calendar size={12} className="mr-2" />
                        {n.time}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary font-bold leading-relaxed mb-6 opacity-80">{n.body}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="text-[10px] font-black uppercase tracking-widest text-accent-primary hover:text-text-primary transition-colors">Mark as resolved</button>
                        <span className="text-border-subtle opacity-30">|</span>
                        <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40 hover:text-rose-500 hover:opacity-100 transition-all">Archive Protocol</button>
                      </div>
                      <ChevronRight size={18} className="text-text-secondary opacity-20 group-hover:text-accent-primary transition-all transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-bg-elevated/30 rounded-[3rem] border-2 border-dashed border-border-subtle">
               <div className="w-20 h-20 bg-bg-surface rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-text-secondary opacity-20 shadow-xl">
                  <Filter size={32} />
               </div>
               <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-40">Operational log is currently clear</p>
            </div>
          )}
        </div>

        <div className="mt-16 p-10 rounded-[3rem] bg-accent-primary/5 border border-accent-primary/20 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
           <div className="relative z-10 text-center lg:text-left">
              <h3 className="text-xl font-black text-text-primary tracking-tighter uppercase leading-none mb-3">Protocol Optimization</h3>
              <p className="text-xs font-bold text-text-secondary opacity-60">Configure Neural Sync & Strategic Alert triggers in your secure portal.</p>
           </div>
           <button 
             onClick={() => (window.location.href = "/settings")}
             className="px-12 py-5 bg-accent-primary text-bg-main text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-accent-primary/20 hover:bg-opacity-90 active:scale-95 transition-all whitespace-nowrap"
           >
             Access Settings
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
