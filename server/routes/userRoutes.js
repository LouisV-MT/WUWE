const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { protect } = require('../middleware/authMiddleware');

// ALL routes below this line require a valid JWT token!
router.use(protect);

// --- PROFILE ---
// GET /api/users/me
router.get('/me', (req, res) => userController.getProfile(req, res));

// PUT /api/users/me/preferences
router.put('/me/preferences', (req, res) => userController.updatePreferences(req, res));

// POST /api/users/me/saved
router.post('/me/saved', (req, res) => userController.toggleSavedRestaurant(req, res));

// --- JOURNAL ---
// GET /api/users/me/journal
router.get('/me/journal', (req, res) => userController.getJournal(req, res));

// POST /api/users/me/journal
router.post('/me/journal', (req, res) => userController.addJournalEntry(req, res));

module.exports = router;