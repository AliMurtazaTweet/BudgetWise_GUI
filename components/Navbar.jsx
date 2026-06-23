import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Info,
  CreditCard,
  Zap,
  Sun,
  Moon
} from "lucide-react";

export default function Navbar({ toggleSidebar, user }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnread, setHasUnread] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  const clearNotifications = () => {
    setHasUnread(false);
    localStorage.setItem("budgetwise_has_unread", "false");
    setShowNotifications(false);
    router.push("/notifications");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/transactions?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Mock notifications
  const notifications = [
    { title: "Budget Limit", body: "You have used 85% of your Food budget.", time: "10 mins ago", color: "text-amber-500", link: "/budgets", icon: Zap },
    { title: "New Transaction", body: "$14.50 spent at Starbucks.", time: "1 hour ago", color: "text-indigo-600", link: "/transactions", icon: CreditCard },
  ];

  const handleNotificationClick = (link) => {
    setShowNotifications(false);
    router.push(link);
  };

  let avatarUrl = null;
  if (user?.preferences) {
    try {
      const prefs = typeof user.preferences === 'string'
        ? JSON.parse(user.preferences)
        : user.preferences;
      avatarUrl = prefs?.profile?.avatarUrl || null;
    } catch (e) {
      // Fallback: no avatar
    }
  }
  // Also allow avatar to be passed directly on the user object
  if (!avatarUrl && user?.avatar) {
    avatarUrl = user.avatar;
  }

  return (
    <header className="bg-bg-main/80 backdrop-blur-md border-b border-border-subtle sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center justify-between px-6 sm:px-10 h-20">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2.5 -ml-2 mr-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all active:scale-90"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <form onSubmit={handleSearch} className="hidden sm:flex px-4 py-2.5 bg-bg-elevated/50 rounded-2xl items-center w-72 focus-within:ring-2 focus-within:ring-accent-primary/20 focus-within:bg-bg-surface focus-within:shadow-lg focus-within:shadow-accent-primary/5 border border-transparent focus-within:border-accent-primary/20 transition-all group">
            <Search className="h-4 w-4 text-slate-400 mr-3 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder-slate-400 font-medium"
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-3 bg-bg-surface text-text-secondary hover:text-accent-primary hover:bg-bg-main rounded-2xl transition-all shadow-sm active:scale-95 group"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`group relative p-3 rounded-2xl transition-all duration-500 ${
                showNotifications 
                ? 'bg-accent-primary text-bg-main shadow-xl shadow-accent-primary/20' 
                : 'bg-bg-elevated text-text-secondary hover:bg-bg-surface hover:text-accent-primary hover:shadow-lg hover:shadow-accent-primary/10'
              }`}
            >
              <Bell className={`h-5 w-5 transition-transform duration-500 ${showNotifications ? 'scale-110 text-bg-main' : 'group-hover:rotate-12'}`} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-bg-main shadow-sm z-20">
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 pt-2 w-80 z-50">
                <div className="bg-bg-surface rounded-3xl shadow-2xl shadow-text-primary/10 border border-border-subtle py-3 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <div className="px-6 py-3 border-b border-border-subtle flex justify-between items-center bg-bg-elevated/30">
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Recent Alerts</span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">2 NEW</span>
                  </div>
                  <div className="divide-y divide-border-subtle max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n, i) => {
                      const Icon = n.icon;
                      return (
                        <div 
                          key={i} 
                          onClick={() => handleNotificationClick(n.link)}
                          className="px-6 py-4 hover:bg-bg-elevated/50 transition-all cursor-pointer group"
                        >
                          <div className="flex space-x-4 items-center">
                            <div className={`p-1.5 rounded-xl bg-bg-surface border border-border-subtle ${n.color} shrink-0 shadow-sm group-hover:scale-110 transition-transform group-hover:border-accent-primary/30`}>
                              <Icon size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-accent-primary transition-colors">{n.title}</p>
                              <p className="text-xs text-text-secondary mt-1 lines-clamp-2 leading-relaxed opacity-80">{n.body}</p>
                              <p className="text-[10px] text-text-secondary mt-2 font-bold tracking-tight opacity-40">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-6 py-3 border-t border-border-subtle mt-2">
                    <button 
                      onClick={clearNotifications}
                      className="w-full py-3 bg-text-primary text-bg-main text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-primary transition-all shadow-lg hover:shadow-accent-primary/20 active:scale-95"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-1.5 pl-4 rounded-2xl hover:bg-bg-elevated transition-all border border-transparent active:scale-95 group"
            >
              <div className="hidden lg:block text-right pr-1">
                <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-accent-primary transition-colors uppercase tracking-tight">{user?.name || "User"}</p>
                <p className="text-[10px] text-text-secondary font-bold mt-0.5 opacity-60">PREMIUM MEMBER</p>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-text-primary border-2 border-border-subtle text-bg-main flex items-center justify-center font-bold text-sm shadow-xl overflow-hidden group-hover:scale-105 transition-transform group-hover:shadow-accent-primary/10">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getUserInitials()
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-text-secondary opacity-40 transition-transform hidden sm:block ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 pt-2 w-60 z-50">
                <div className="bg-bg-surface rounded-3xl shadow-2xl shadow-text-primary/10 border border-border-subtle py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-6 pb-4 mb-2 border-b border-border-subtle lg:hidden">
                    <p className="text-sm font-bold text-text-primary leading-tight uppercase tracking-tight">{user?.name || "User"}</p>
                    <p className="text-[10px] text-text-secondary font-bold mt-1 tracking-tighter opacity-60">{user?.email || "ali@example.com"}</p>
                  </div>
                  <Link 
                    href="/settings" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center px-6 py-3 text-xs font-bold text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all group"
                  >
                    <div className="p-2 bg-bg-elevated rounded-xl mr-4 group-hover:bg-bg-surface group-hover:shadow-sm transition-all text-text-secondary opacity-40 group-hover:opacity-100 group-hover:text-amber-500">
                      <User size={14} />
                    </div>
                    Account Info
                  </Link>
                  <Link 
                    href="/settings" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center px-6 py-3 text-xs font-bold text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all group"
                  >
                    <div className="p-2 bg-bg-elevated rounded-xl mr-4 group-hover:bg-bg-surface group-hover:shadow-sm transition-all text-text-secondary opacity-40 group-hover:opacity-100 group-hover:text-accent-primary">
                      <Settings size={14} />
                    </div>
                    App Settings
                  </Link>
                  <div className="mx-6 my-3 border-t border-border-subtle" />
                  <button 
                    onClick={() => router.push("/login")}
                    className="w-[calc(100%-48px)] mx-6 flex items-center px-4 py-3 text-xs font-bold text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-600 hover:text-white transition-all group shadow-sm active:scale-95"
                  >
                    <LogOut size={14} className="mr-3 text-rose-500 opacity-60 group-hover:text-white transition-colors" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
