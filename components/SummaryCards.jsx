import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SummaryCards({ cards }) {
  if (!cards) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="group relative bg-bg-surface rounded-[1.75rem] shadow-xl shadow-text-primary/5 border border-border-subtle overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent-primary/10 hover:-translate-y-1">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.03] dark:opacity-[0.05] -mr-6 -mt-6 rounded-full transition-transform duration-700 group-hover:scale-150 ${card.bgColor}`} />
            
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center mb-5">
                <div className={`p-3 rounded-2xl ${card.bgColor} dark:bg-opacity-20 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-tight ${
                  card.isPositive 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                }`}>
                  {card.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{card.trend.includes('%') ? card.trend : 'TRACKED'}</span>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1.5 opacity-60">{card.title}</p>
                <h3 className="text-2xl font-extrabold text-text-primary tracking-tight group-hover:text-accent-primary transition-colors duration-300">{card.amount}</h3>
                <p className="text-[9px] text-text-secondary mt-1.5 font-bold opacity-40">NET FLOW CALCULATION</p>
              </div>
            </div>
            
            {/* Bottom Glow Indicator */}
            <div className={`h-1 w-full absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${card.bgColor}`} />
          </div>
        );
      })}
    </div>
  );
}
