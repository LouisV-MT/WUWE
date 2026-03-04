const restaurantService = require('../services/RestaurantService');

class RestaurantController {

  // GET /nearby
  async getNearby(req, res) {
    try {
      const data = await restaurantService.getDiscoveryResults(req.query);
      
      res.json(data);
    } catch (err) {
      console.error("Discovery Error:", err.message);
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  }

  // GET /recommend/:id
  async recommend(req, res) {
    try {
      const { id } = req.params;
      const recommendations = await restaurantService.getRecommendations(id);
      res.json(recommendations);
    } catch (err) {
      console.error("Controller Error:", err.message);
      if (err.message === "Restaurant not found") {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Recommendation failed" });
    }
  }
}

module.exports = new RestaurantController();