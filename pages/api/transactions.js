import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'transactions.json');
    const transactions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Support multi-user isolation by filtering by userId
    const { userId } = req.query;
    const filteredTransactions = userId 
      ? transactions.filter(t => String(t.userId) === String(userId))
      : transactions;

    return res.status(200).json(filteredTransactions);
  } catch (error) {
    console.error("Transactions restoration failed:", error);
    return res.status(500).json({ status: "error", message: "Failed to read transactions" });
  }
}
