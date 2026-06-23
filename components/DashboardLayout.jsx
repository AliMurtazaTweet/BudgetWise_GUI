import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import API from "../utils/api";
import CommandPalette from "./CommandPalette";
import ToastProvider from "./ToastProvider";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Immediately hydrate from localStorage for instant display (no flash)
    const savedUser = localStorage.getItem("bw_user");
    const userId = savedUser ? JSON.parse(savedUser).id : 1;

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Seed the user state right away so avatar shows instantly
      setUser({
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        avatar: parsed.avatar || null,
        preferences: parsed.preferences || null,
        role: "Account Owner"
      });
    }

    // 2. Fetch fresh data from API to confirm avatar is up-to-date
    const fetchUser = async () => {
      try {
        // Log runtime baseURL to ensure client uses intended backend URL
        try { console.info('API baseURL:', API.defaults.baseURL); } catch(e) {}
        const userRes = await API.get(`/user?userId=${userId}`);
        if (userRes.data.status === "success") {
          const freshUser = userRes.data.user;
          setUser(freshUser);

          // Keep localStorage in sync with fresh data
          if (savedUser) {
            const sessionUser = JSON.parse(savedUser);
            localStorage.setItem("bw_user", JSON.stringify({
              ...sessionUser,
              name: freshUser.name,
              email: freshUser.email,
              avatar: freshUser.avatar,
              preferences: freshUser.preferences
            }));
          }
        }
      } catch (err) {
        // Improve logging so we can see network vs response errors in the browser
        if (err.response) {
          console.error("Failed to fetch user - response error:", err.response.status, err.response.data);
        } else if (err.request) {
          console.error("Failed to fetch user - no response received (network error or CORS):", err.message);
        } else {
          console.error("Failed to fetch user - request setup error:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden font-sans transition-colors duration-500">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <Navbar toggleSidebar={() => setSidebarOpen(true)} user={user} />
        <ToastProvider>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 custom-scrollbar bg-bg-surface/30">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </ToastProvider>
      </div>
      <CommandPalette />
    </div>
  );
}
