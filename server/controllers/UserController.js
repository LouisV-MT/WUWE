const userService = require('../services/UserService');

class UserController {

  // GET /api/users/me
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Extracted from the token by middleware
      const profile = await userService.getUserProfile(userId);
      res.status(200).json(profile);
    } catch (err) {
      console.error("Profile Error:", err.message);
      res.status(404).json({ error: err.message });
    }
  }

  // PUT /api/users/me/preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const prefsData = req.body;
      
      const updatedProfile = await userService.updatePreferences(userId, prefsData);
      res.status(200).json(updatedProfile);
    } catch (err) {
      console.error("Update Prefs Error:", err.message);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  }

  // POST /api/users/me/saved
  async toggleSavedRestaurant(req, res) {
    try {
      const userId = req.user.id;
      const { restaurantId, action } = req.body; // action = "save" or "remove"

      if (!['save', 'remove'].includes(action)) {
        return res.status(400).json({ error: "Action must be 'save' or 'remove'" });
      }

      const updatedProfile = await userService.toggleSavedRestaurant(userId, restaurantId, action);
      res.status(200).json(updatedProfile);
    } catch (err) {
      console.error("Save Restaurant Error:", err.message);
      res.status(500).json({ error: "Failed to update saved restaurants" });
    }
  }

  // ==========================================
  // THE JOURNAL ENDPOINTS
  // ==========================================

  // GET /api/users/me/journal
  async getJournal(req, res) {
    try {
      const userId = req.user.id;
      const journal = await userService.getUserJournal(userId);
      res.status(200).json(journal);
    } catch (err) {
      console.error("Get Journal Error:", err.message);
      res.status(500).json({ error: "Failed to fetch journal" });
    }
  }

  // POST /api/users/me/journal
  async addJournalEntry(req, res) {
    try {
      const userId = req.user.id;
      const visitData = req.body;

      if (!visitData.restaurant_id) {
        return res.status(400).json({ error: "Restaurant ID is required to log a visit" });
      }

      const newEntry = await userService.addJournalEntry(userId, visitData);
      res.status(201).json(newEntry);
    } catch (err) {
      console.error("Add Journal Error:", err.message);
      res.status(500).json({ error: "Failed to save journal entry" });
    }
  }
}

module.exports = new UserController();