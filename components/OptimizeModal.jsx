import { useState } from "react";
import { X } from "lucide-react";

export default function OptimizeModal({ open, onClose, suggestions = [], onApply }) {
  const [selected, setSelected] = useState(() => suggestions.map(s => s.category));
  const [applying, setApplying] = useState(false);

  if (!open) return null;

  const toggle = (category) => {
    setSelected(sel => sel.includes(category) ? sel.filter(s => s !== category) : [...sel, category]);
  };

  const accepted = suggestions.filter(s => selected.includes(s.category));
  const totalDelta = accepted.reduce((acc, s) => acc + s.delta, 0);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg-surface w-full max-w-lg rounded-2xl p-6 border border-border-subtle shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-text-primary">Quick Optimize Budgets</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-text-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-4">Suggested conservative adjustments based on recent usage. Toggle items you want to apply.</p>

        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
          {suggestions.length === 0 && <div className="text-text-secondary text-sm">No suggestions at the moment.</div>}
          {suggestions.map((s) => (
            <label key={s.category} className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
              <div className="flex items-start">
                <input type="checkbox" checked={selected.includes(s.category)} onChange={() => toggle(s.category)} className="mr-3 mt-1" />
                <div>
                  <div className="font-bold text-text-primary">{s.category}</div>
                  <div className="text-sm text-text-secondary">{s.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold">${s.suggestedLimit.toLocaleString()}</div>
                <div className="text-xs text-text-secondary">Δ {s.delta >= 0 ? '+' : ''}{s.delta}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">Total change: <span className="font-bold text-text-primary">{totalDelta >= 0 ? '+' : ''}{totalDelta}</span></div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-bg-elevated rounded-lg font-bold text-text-secondary hover:text-text-primary">Cancel</button>
            <button
              onClick={async () => {
                try {
                  setApplying(true);
                  await onApply(accepted);
                } catch (e) {
                  // swallow - parent shows toast
                } finally {
                  setApplying(false);
                  onClose();
                }
              }}
              disabled={applying}
              className={`px-4 py-2 bg-accent-primary text-bg-main rounded-lg font-extrabold hover:opacity-95 ${applying ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {applying ? 'Applying…' : 'Apply Suggestions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
