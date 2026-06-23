const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { userId, suggestions } = req.body || {};
    if (!userId || !Array.isArray(suggestions) || suggestions.length === 0) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    for (const suggestion of suggestions) {
      const category = suggestion.category;
      const limit = suggestion.suggestedLimit ?? suggestion.limit;
      if (!category || limit == null) {
        return res.status(400).json({ message: 'Each suggestion needs category and suggestedLimit' });
      }

      const response = await fetch(`${BACKEND_URL}/api/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          category,
          limit: parseFloat(limit),
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `Failed to update ${category}`);
      }
    }

    const budgetsRes = await fetch(`${BACKEND_URL}/api/budgets?userId=${encodeURIComponent(userId)}`);
    if (!budgetsRes.ok) {
      throw new Error('Budgets updated but failed to reload');
    }

    const updated = await budgetsRes.json();
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Failed to apply budget suggestions:', err);
    const message = err.cause?.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')
      ? 'Backend server unavailable. Start budgetwise_server.exe on port 8080.'
      : 'Failed to apply suggestions';
    return res.status(500).json({ message });
  }
}
