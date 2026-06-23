import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'transactions.json');
    const transactions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const filteredTransactions = transactions.filter(t => t.id !== parseInt(transactionId));

    fs.writeFileSync(dataPath, JSON.stringify(filteredTransactions, null, 4));

    return res.status(200).json({
      status: "success",
      message: `Transaction ${transactionId} deleted successfully`
    });
  } catch (error) {
    console.error("Transaction delete failed:", error);
    return res.status(500).json({ status: "error", message: "Failed to delete transaction" });
  }
}
