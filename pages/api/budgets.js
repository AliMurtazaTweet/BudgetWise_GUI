import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'budgets.json');
    const budgets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Support multi-user isolation
    const { userId } = req.query;
    const filteredBudgets = userId 
      ? budgets.filter(b => String(b.userId) === String(userId))
      : budgets;

    return res.status(200).json(filteredBudgets);
  } catch (error) {
    console.error("Budgets restoration failed:", error);
    return res.status(500).json({ status: "error", message: "Failed to read budgets" });
  }
}
