import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";

function toneStyles(tone) {
  switch (tone) {
    case "danger":
      return {
        icon: AlertTriangle,
        badge: "bg-rose-500/10 text-rose-500",
        ring: "border-rose-500/20",
        dot: "bg-rose-500"
      };
    case "warning":
      return {
        icon: AlertTriangle,
        badge: "bg-amber-500/10 text-amber-500",
        ring: "border-amber-500/20",
        dot: "bg-amber-500"
      };
    case "success":
      return {
        icon: CheckCircle2,
        badge: "bg-emerald-500/10 text-emerald-500",
        ring: "border-emerald-500/20",
        dot: "bg-emerald-500"
      };
    case "info":
      return {
        icon: Info,
        badge: "bg-indigo-500/10 text-accent-primary",
        ring: "border-indigo-500/20",
        dot: "bg-indigo-500"
      };
    default:
      return {
        icon: Sparkles,
        badge: "bg-text-primary/5 text-text-secondary",
        ring: "border-border-subtle",
        dot: "bg-text-secondary/40"
      };
  }
}

export default function InsightsTimeline({ insights = [] }) {
  return (
    <div className="bg-bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl shadow-text-primary/5 overflow-hidden">
      <div className="p-7 sm:p-9 border-b border-border-subtle bg-bg-elevated/20">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-accent-primary/10 text-accent-primary border border-accent-primary/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
              Insights Timeline
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-1">
              What to do next
            </h3>
            <p className="text-sm text-text-secondary font-medium mt-2 opacity-80">
              Actionable signals generated from your current spend, budget, and recent activity.
            </p>
          </div>
          <Link
            href="/analytics"
            className="hidden sm:inline-flex px-4 py-2 rounded-2xl bg-bg-surface border border-border-subtle text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
          >
            View Analytics →
          </Link>
        </div>
      </div>

      <div className="p-7 sm:p-9">
        {insights.length === 0 ? (
          <div className="bg-bg-elevated/40 border border-border-subtle rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-text-secondary opacity-70">
              Add a few transactions to unlock insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((it, idx) => {
              const s = toneStyles(it.tone);
              const Icon = s.icon;
              return (
                <div
                  key={`${it.title}-${idx}`}
                  className={`relative rounded-2xl border ${s.ring} bg-bg-elevated/20 hover:bg-bg-elevated/35 transition-all p-5 sm:p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      <div className={`h-10 w-10 rounded-2xl border border-border-subtle bg-bg-surface flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${s.badge}`}>
                          {it.tone || "signal"}
                        </span>
                        <span className="text-[10px] font-bold text-text-secondary opacity-50">
                          Insight #{idx + 1}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
                        {it.title}
                      </h4>
                      <p className="mt-2 text-sm text-text-secondary font-medium leading-relaxed opacity-80">
                        {it.body}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center justify-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

