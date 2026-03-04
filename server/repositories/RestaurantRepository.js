// server/repositories/RestaurantRepository.js
const Restaurant = require('../models/Restaurant');

class RestaurantRepository {
  
  // ==========================================
  // READ OPERATIONS
  // ==========================================

  async findById(id) {
    return await Restaurant.findById(id);
  }

  /**
   * The "Smart Discovery" Engine.
   * Handles Location bounds, Text search, and Category filtering.
   */
  async findWithFilters(criteria) {
    const { userLat, userLng, maxDist, search, cuisine, limit = 50 } = criteria;
    const query = {};

    // 1. Geolocation Filter (Requires coordinates)
    if (userLat && userLng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [userLng, userLat] },
          $maxDistance: maxDist || 5000
        }
      };
    }

    // 2. Text Search (Matches name)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 3. Cuisine Filter (Matches sub_region or specific style)
    if (cuisine) {
      query.$or = [
        { "cuisine_taxonomy.sub_region": cuisine },
        { "cuisine_taxonomy.style": cuisine }
      ];
    }

    // Execute query. If NO location is provided, sort by best rating.
    let dbQuery = Restaurant.find(query);
    if (!userLat || !userLng) {
      dbQuery = dbQuery.sort({ "rating_stats.average": -1 });
    }

    // Select only what we need to keep payloads light
    return await dbQuery
      .select('name location cuisine_taxonomy vibe_vector rating_stats amenities_tags video_reviews')
      .limit(limit);
  }

  /**
   * Used by the Recommendation Engine to grab candidates to score.
   */
  async findCandidates(excludeId, limit = 300) {
    return await Restaurant.find({ _id: { $ne: excludeId } })
      .select('name cuisine_taxonomy vibe_vector amenities_tags location rating_stats')
      .limit(limit);
  }

  // ==========================================
  // WRITE OPERATIONS
  // ==========================================

  async save(restaurantDoc) {
    return await restaurantDoc.save();
  }

  /**
   * Applies the vibe of a single analyzed restaurant to all its peers.
   */
  async updateBatchVibe(subRegion, vibeVector, sourceLabel) {
    return await Restaurant.updateMany(
      { 
        "cuisine_taxonomy.sub_region": subRegion, 
        is_enriched: false 
      },
      { 
        $set: {
          vibe_vector: vibeVector,
          is_enriched: true,
          enrichment_source: sourceLabel,
          last_enriched: new Date()
        }
      }
    );
  }
}

module.exports = new RestaurantRepository();