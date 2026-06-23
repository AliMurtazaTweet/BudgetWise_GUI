import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'transactions.json');
    const transactions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const { transactionId, merchant, amount, category, type, date, userId } = req.body;

    let newTransaction;

    if (transactionId) {
      // Update existing
      const index = transactions.findIndex(t => t.id === parseInt(transactionId));
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          merchant: merchant || transactions[index].merchant,
          amount: parseFloat(amount) || transactions[index].amount,
          category: category || transactions[index].category,
          type: type || transactions[index].type,
          date: date || transactions[index].date
        };
        newTransaction = transactions[index];
      }
    } else {
      // Create new
      const maxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) : 0;
      newTransaction = {
        id: maxId + 1,
        date: date || new Date().toISOString(),
        merchant: merchant || category,
        amount: parseFloat(amount) || 0,
        category: category,
        type: type,
        userId: parseInt(userId) || 1
      };
      transactions.push(newTransaction);
    }

    fs.writeFileSync(dataPath, JSON.stringify(transactions, null, 4));

    return res.status(200).json({
      status: "success",
      message: transactionId ? "Transaction updated" : "Transaction created",
      data: newTransaction
    });
  } catch (error) {
    console.error("Transaction write failed:", error);
    return res.status(500).json({ status: "error", message: "Failed to save transaction" });
  }
}
