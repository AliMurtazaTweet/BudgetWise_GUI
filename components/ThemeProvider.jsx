import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "budgetwise_theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      const next = saved === "dark" ? "dark" : defaultTheme;
      setTheme(next);
    } catch {
      setTheme(defaultTheme);
    }
  }, [defaultTheme]);

  useEffect(() => {
    if (!isMounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors (private mode, disabled storage, etc.)
    }
  }, [isMounted, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      isMounted,
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
      storageKey: THEME_STORAGE_KEY
    }),
    [isMounted, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

