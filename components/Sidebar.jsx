import Link from "next/link";
import { useRouter } from "next/router";
import { 
  Home, 
  CreditCard, 
  PieChart, 
  FileText, 
  BarChart2,
  Settings, 
  X,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Budgets", href: "/budgets", icon: PieChart },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-main border-r border-border-subtle shadow-xl md:shadow-none transform transition-all duration-500 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-7 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-500/10">
                <ShieldCheck className="text-white h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold text-text-primary tracking-tight">BudgetWise</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-1 space-y-1.5 overflow-hidden">
            <p className="px-4 text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-3 opacity-60">Main Menu</p>
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-500/20 scale-[1.02]"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-accent-primary"
                  }`}
                >
                  <Icon className={`mr-4 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-text-secondary group-hover:text-accent-primary"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-border-subtle">
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                router.pathname === "/settings"
                  ? "bg-text-primary text-bg-main shadow-lg shadow-text-primary/10 scale-[1.02]"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              }`}
            >
              <Settings className={`mr-4 h-5 w-5 transition-transform duration-300 group-hover:rotate-45 ${router.pathname === "/settings" ? "text-bg-main" : "text-text-secondary group-hover:text-text-primary"}`} />
              Settings
            </Link>
            
            <Link href="/premium" className="block mt-5 p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/10 flex items-center space-x-3 hover:bg-accent-primary/10 transition-colors group/premium cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold text-accent-primary truncate uppercase tracking-tight">Premium Account</p>
                <p className="text-[10px] text-accent-primary font-bold mt-0.5 opacity-60">Expires in 24 days</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent-primary animate-pulse group-hover/premium:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
