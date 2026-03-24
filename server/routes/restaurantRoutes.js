const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/RestaurantController');
const enrichmentController = require('../controllers/EnrichmentController');

// --- PUBLIC READS ---
// GET /api/restaurants/nearby
router.get('/nearby', (req, res) => restaurantController.getNearby(req, res));

// GET /api/restaurants/recommend/:id
router.get('/recommend/:id', (req, res) => restaurantController.recommend(req, res));

// --- ADMIN / AI WRITES ---
// POST /api/restaurants/enrich/:id
router.post('/enrich/:id', protect, (req, res) => {
  enrichmentController.enrichRestaurant(req, res);
});

module.exports = router;