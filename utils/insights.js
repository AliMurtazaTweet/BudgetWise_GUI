function safeNum(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

function monthProgress(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  return { dayOfMonth, daysInMonth, remainingDays: Math.max(daysInMonth - dayOfMonth, 0) };
}

function topBreakdown(breakdown = {}) {
  return Object.entries(breakdown || {})
    .map(([category, amount]) => ({ category, amount: safeNum(amount) }))
    .filter((x) => x.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function buildInsights({ analytics, transactions = [], monthlyBudget = 0 }) {
  const income = safeNum(analytics?.income);
  const expense = safeNum(analytics?.expense);
  const savings = safeNum(analytics?.savings);
  const breakdown = analytics?.breakdown || {};

  const items = [];
  const { dayOfMonth, daysInMonth, remainingDays } = monthProgress();

  // Pace-to-budget (if monthly budget configured)
  const mb = safeNum(monthlyBudget);
  if (mb > 0 && expense >= 0) {
    const pct = mb > 0 ? Math.round((expense / mb) * 100) : 0;
    const dailyBurn = dayOfMonth > 0 ? expense / dayOfMonth : 0;
    const projected = dailyBurn * daysInMonth;
    const projectedOver = projected - mb;

    if (pct >= 100) {
      items.push({
        tone: "danger",
        title: "Monthly budget exceeded",
        body: `You’ve used ${pct}% of your monthly limit. Consider pausing discretionary spending for the next ${remainingDays} days.`
      });
    } else if (pct >= 80) {
      items.push({
        tone: "warning",
        title: "Approaching your monthly limit",
        body: `You’ve used ${pct}% of your budget. At this pace, you may exceed your limit by ~$${Math.max(Math.round(projectedOver), 0).toLocaleString()} by month-end.`
      });
    } else {
      items.push({
        tone: "success",
        title: "Spending is on track",
        body: `You’ve used ${pct}% of your budget. Keep your daily spend near ~$${Math.round(dailyBurn).toLocaleString()} to stay under $${mb.toLocaleString()}.`
      });
    }
  }

  // Category concentration
  const top = topBreakdown(breakdown);
  if (top.length > 0 && expense > 0) {
    const t = top[0];
    const share = Math.round((t.amount / expense) * 100);
    if (share >= 35) {
      items.push({
        tone: "info",
        title: "One category is dominating spend",
        body: `${t.category} accounts for ~${share}% of expenses ($${Math.round(t.amount).toLocaleString()}). Consider setting a tighter cap for this category.`
      });
    } else {
      items.push({
        tone: "info",
        title: "Top spending category",
        body: `${t.category} is your highest category at $${Math.round(t.amount).toLocaleString()} so far.`
      });
    }

    const runnerUps = top.slice(1, 3);
    if (runnerUps.length > 0) {
      items.push({
        tone: "neutral",
        title: "Next biggest categories",
        body: runnerUps
          .map((x) => `${x.category} ($${Math.round(x.amount).toLocaleString()})`)
          .join(" • ")
      });
    }
  }

  // Savings rate cue
  if (income > 0) {
    const rate = Math.round((savings / income) * 100);
    if (rate < 10) {
      items.push({
        tone: "warning",
        title: "Savings rate is low",
        body: `Your savings rate is ~${rate}%. If you can, aim for 15–20% by reducing your top 1–2 categories.`
      });
    } else {
      items.push({
        tone: "success",
        title: "Healthy savings rate",
        body: `You’re saving ~${rate}% of income. Consider moving an extra small amount into savings automatically.`
      });
    }
  }

  // Recent activity
  if (transactions.length > 0) {
    const last = transactions[0];
    if (last?.type === "Expense") {
      items.push({
        tone: "neutral",
        title: "Last expense recorded",
        body: `$${safeNum(last.amount).toLocaleString()} in ${last.category}${last.merchant ? ` at ${last.merchant}` : ""}.`
      });
    } else if (last?.type === "Income") {
      items.push({
        tone: "neutral",
        title: "Last income recorded",
        body: `$${safeNum(last.amount).toLocaleString()} received in ${last.category}${last.merchant ? ` from ${last.merchant}` : ""}.`
      });
    }
  }

  // Keep it concise
  return items.slice(0, 6);
}

