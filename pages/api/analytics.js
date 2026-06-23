import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'transactions.json');
    const allTransactions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Support multi-user isolation
    const { userId } = req.query;
    const transactions = userId 
      ? allTransactions.filter(t => String(t.userId) === String(userId))
      : allTransactions;

    let income = 0;
    let expense = 0;
    const breakdown = {};

    transactions.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0;
      if (tx.type === 'Income') {
        income += amt;
      } else {
        expense += amt;
        const cat = tx.category || 'Other';
        if (!breakdown[cat]) {
          breakdown[cat] = 0;
        }
        breakdown[cat] += amt;
      }
    });

    const savings = Math.max(0, income - expense);

    return res.status(200).json({
      status: "success",
      income,
      expense,
      savings,
      breakdown
    });
  } catch (error) {
    console.error("Analytics calculation failed:", error);
    return res.status(500).json({ status: "error", message: "Failed to calculate analytics" });
  }
}
