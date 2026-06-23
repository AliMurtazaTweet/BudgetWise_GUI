import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowRight,
  BarChart2,
  CreditCard,
  Home,
  PieChart,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  X
} from "lucide-react";

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

function emitQuickAdd(type) {
  try {
    window.dispatchEvent(new CustomEvent("bw:quickAdd", { detail: { type } }));
    return true;
  } catch {
    return false;
  }
}

export default function CommandPalette() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = useMemo(() => {
    const q = normalize(query);

    const base = [
      { id: "nav_dashboard", label: "Go to Dashboard", hint: "/dashboard", icon: Home, run: () => router.push("/dashboard") },
      { id: "nav_transactions", label: "Go to Transactions", hint: "/transactions", icon: CreditCard, run: () => router.push("/transactions") },
      { id: "nav_budgets", label: "Go to Budgets", hint: "/budgets", icon: PieChart, run: () => router.push("/budgets") },
      { id: "nav_analytics", label: "Go to Analytics", hint: "/analytics", icon: BarChart2, run: () => router.push("/analytics") },
      { id: "nav_reports", label: "Go to Reports", hint: "/reports", icon: Sparkles, run: () => router.push("/reports") },
      { id: "nav_settings", label: "Go to Settings", hint: "/settings", icon: Settings, run: () => router.push("/settings") }
    ];

    const quick = [
      {
        id: "quick_add_income",
        label: "Quick Add: Income",
        hint: "Open modal",
        icon: PlusCircle,
        run: async () => {
          const emitted = emitQuickAdd("Income");
          if (!emitted) await router.push("/dashboard?qa=Income");
        }
      },
      {
        id: "quick_add_expense",
        label: "Quick Add: Expense",
        hint: "Open modal",
        icon: PlusCircle,
        run: async () => {
          const emitted = emitQuickAdd("Expense");
          if (!emitted) await router.push("/dashboard?qa=Expense");
        }
      }
    ];

    const searchActions = q
      ? [
          {
            id: "search_transactions",
            label: `Search Transactions: “${query}”`,
            hint: "/transactions?q=",
            icon: Search,
            run: () => router.push(`/transactions?q=${encodeURIComponent(query)}`)
          }
        ]
      : [];

    const all = [...searchActions, ...quick, ...base];
    if (!q) return all;

    return all.filter((a) => normalize(a.label).includes(q) || normalize(a.hint).includes(q));
  }, [query, router]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      const isK = key === "k";
      const withMeta = e.metaKey || e.ctrlKey;
      if (withMeta && isK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (key === "escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (key === "arrowdown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(actions.length - 1, 0)));
        return;
      }
      if (key === "arrowup") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (key === "enter") {
        e.preventDefault();
        const action = actions[activeIndex];
        if (!action) return;
        setOpen(false);
        setQuery("");
        setActiveIndex(0);
        action.run();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [actions, activeIndex, open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onRoute = () => setOpen(false);
    router.events?.on("routeChangeStart", onRoute);
    return () => router.events?.off("routeChangeStart", onRoute);
  }, [router.events]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />

      <div className="absolute left-1/2 top-24 w-[min(720px,calc(100%-32px))] -translate-x-1/2">
        <div className="bg-bg-surface border border-border-subtle rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border-subtle bg-bg-elevated/30">
            <div className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-secondary">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none border-none text-text-primary font-bold placeholder:text-text-secondary/60"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-bg-surface transition-all text-text-secondary hover:text-text-primary"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-2">
            {actions.length === 0 ? (
              <div className="px-4 py-10 text-center text-text-secondary font-bold text-sm opacity-70">
                No matches.
              </div>
            ) : (
              actions.map((a, idx) => {
                const Icon = a.icon;
                const active = idx === activeIndex;
                return (
                  <button
                    key={a.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      setActiveIndex(0);
                      a.run();
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left ${
                      active ? "bg-accent-primary/10 border border-accent-primary/20" : "hover:bg-bg-elevated"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl border border-border-subtle ${
                        active ? "text-accent-primary bg-bg-surface" : "text-text-secondary bg-bg-surface"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-extrabold text-sm ${active ? "text-text-primary" : "text-text-primary"}`}>
                        {a.label}
                      </div>
                      {a.hint ? (
                        <div className="text-[11px] font-bold text-text-secondary opacity-50 truncate">{a.hint}</div>
                      ) : null}
                    </div>
                    <ArrowRight className={`shrink-0 ${active ? "text-accent-primary" : "text-text-secondary/40"}`} size={16} />
                  </button>
                );
              })
            )}
          </div>

          <div className="px-6 py-4 border-t border-border-subtle bg-bg-elevated/20 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
            <span>Ctrl/Cmd+K</span>
            <span>Enter to run • Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

