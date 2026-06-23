// Simple budget optimizer util
export function computeBudgetSuggestions({ analytics = {}, budgets = [], transactions = [], monthlyBudget = 0 } = {}) {
  const getPercentage = (spent, limit) => Math.min(Math.round((spent / limit) * 100), 100);

  const suggestions = budgets.map((b) => {
    const name = b.category || b.name || 'Unknown';
    const spent = b.spentAmount || b.spent || 0;
    const limit = b.monthlyLimit || b.limit || 1;
    const pct = getPercentage(spent, limit);

    // conservative suggestions:
    // - if near or above limit, suggest +10% (to avoid accidental overages)
    // - if underutilized (<20%), suggest -10% to free budget
    // - otherwise, no change
    let suggestedLimit = limit;
    let reason = 'No change needed';

    if (pct >= 90) {
      suggestedLimit = Math.round(limit * 1.10);
      reason = `High usage (${pct}%) — increase by 10%`;
    } else if (pct <= 20 && limit > 20) {
      suggestedLimit = Math.max(Math.round(limit * 0.9), 1);
      reason = `Low usage (${pct}%) — decrease by 10%`;
    }

    const delta = suggestedLimit - limit;

    return {
      category: name,
      currentLimit: limit,
      suggestedLimit,
      delta,
      spent,
      percentage: pct,
      reason,
    };
  }).filter(s => s.delta !== 0);

  return suggestions;
}

export default computeBudgetSuggestions;
