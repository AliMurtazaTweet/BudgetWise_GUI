import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Hard-locked absolute path for maximum reliability on this system
  const dataPath = 'C:\\Users\\ALI MURTAZA\\Desktop\\BudgetWise\\budgetwise\\data\\users.json';

  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(dataPath)) {
        return res.status(500).json({ status: "error", message: "Data store missing" });
      }

      const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Support dynamic user fetching via query parameter
      const { userId } = req.query;
      const targetId = parseInt(userId) || 1;
      const user = users.find(u => u.id === targetId) || users[0];

      let parsedPrefs = {};
      if (typeof user.preferences === 'string') {
        try {
          parsedPrefs = JSON.parse(user.preferences);
        } catch (e) {
          console.error("Failed to parse preferences string", e);
        }
      } else if (typeof user.preferences === 'object') {
        parsedPrefs = user.preferences;
      }

      return res.status(200).json({
        status: "success",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "Account Owner",
          avatar: parsedPrefs?.profile?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name),
          preferences: user.preferences
        }
      });
    } catch (error) {
      return res.status(500).json({ status: "error", message: "Failed to read user data" });
    }
  }

  if (req.method === 'POST') {
    try {
      const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const { userId, name, email, password, preferences } = req.body;

      const targetId = parseInt(userId) || 1;
      const index = users.findIndex(u => u.id === targetId);
      
      if (index === -1) {
        return res.status(404).json({ status: "error", message: "Profile not found" });
      }

      // Update fields
      users[index].name = name || users[index].name;
      users[index].email = email || users[index].email;
      if (password) users[index].password = password;
      users[index].preferences = preferences || users[index].preferences;
      users[index].lastSync = new Date().toISOString();

      // Commit to disk
      fs.writeFileSync(dataPath, JSON.stringify(users, null, 4), 'utf8');

      // Parse the saved preferences to extract the avatar for the response
      let avatarUrl = null;
      try {
        const prefs = typeof users[index].preferences === 'string'
          ? JSON.parse(users[index].preferences)
          : users[index].preferences;
        avatarUrl = prefs?.profile?.avatarUrl || null;
      } catch (e) {}

      return res.status(200).json({
        status: "success",
        user: {
          id: users[index].id,
          name: users[index].name,
          email: users[index].email,
          role: "Account Owner",
          avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(users[index].name)}`,
          preferences: users[index].preferences
        }
      });
    } catch (error) {
      return res.status(500).json({ status: "error", message: "Persistence failure" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
