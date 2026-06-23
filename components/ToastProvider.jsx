import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  // Fallback when provider is not mounted yet: provide a safe showToast
  return {
    showToast: (message, { type = 'info' } = {}) => {
      if (typeof window !== 'undefined') {
        const ev = new CustomEvent('bw:toast', { detail: { message, type } });
        window.dispatchEvent(ev);
      } else {
        // server-side: no-op or console fallback
        try { console.log(`[toast:${type}] ${message}`); } catch (e) {}
      }
    }
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  const value = { showToast };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__toastHookInstalled = true;
    const handler = (e) => {
      const detail = e && e.detail ? e.detail : {};
      const { message = '', type = 'info' } = detail;
      showToast(message, { type });
    };
    window.addEventListener('bw:toast', handler);
    return () => window.removeEventListener('bw:toast', handler);
  }, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 bottom-6 z-[1000] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded-2xl shadow-lg text-sm text-bg-main transition-transform transform ${t.type === 'success' ? 'bg-accent-primary' : t.type === 'error' ? 'bg-rose-500' : 'bg-bg-elevated'}` }>
            <div className="flex items-center justify-between">
              <div className="truncate mr-2">{t.message}</div>
              <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="ml-2 text-bg-main opacity-70">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
