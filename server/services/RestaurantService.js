const restaurantRepo = require('../repositories/RestaurantRepository');
const { getRootsScore } = require('../utils/taxonomy');
const { RestaurantResponseDto, RecommendationResponseDto } = require('../dtos/RestaurantDtos');

class RestaurantService {

 /**
   * Flexible Discovery Method
   * Can handle "Near Me", "Search by City", or "Browse Category"
   */
  async getDiscoveryResults(params) {
    // 1. Unpack & Defaults
    // We do NOT hardcode defaults here anymore. 
    // If lat/lng are missing, we treat it as a "City-wide Browse".
    const criteria = {
      userLat: params.lat ? parseFloat(params.lat) : null,
      userLng: params.lng ? parseFloat(params.lng) : null,
      maxDist: params.dist ? parseInt(params.dist) : 5000,
      search: params.search || null,   
      cuisine: params.category || null 
    };

    // 2. Pass to Smart Repo
    const rawDocs = await restaurantRepo.findWithFilters(criteria);

    // 3. Map to DTOs
    return rawDocs.map(doc => new RestaurantResponseDto(doc));
  }

  /**
   * Get recommendations based on a source restaurant
   * @param {string} sourceId - The ID of the restaurant being viewed
   * @returns {Promise<RecommendationResponseDto[]>}
   */
  async getRecommendations(sourceId) {
    // 1. Get the Source Restaurant
    const source = await restaurantRepo.findById(sourceId);
    if (!source) throw new Error("Restaurant not found");

    // 2. Get Candidate Restaurants (Exclude self)
    // Optimization: We fetch 300 candidates to rank
    const candidates = await restaurantRepo.findCandidates(sourceId, 300);

    // 3. The Scoring Algorithm (Business Logic)
    const scoredResults = candidates.map(candidate => {
      // A. Vibe Score (50%) - How similar is the atmosphere?
      const vibeScore = this.calculateVibeScore(source.vibe_vector, candidate.vibe_vector);
      
      // B. Roots Score (30%) - How related are the cuisines?
      const rootsScore = getRootsScore(source.cuisine_taxonomy, candidate.cuisine_taxonomy);
      
      // C. Specs Score (20%) - Do they share amenities (Wifi, Patio, etc)?
      const specsScore = this.calculateSpecsScore(source.amenities_tags, candidate.amenities_tags);

      // Weighted Total
      const totalScore = (vibeScore * 0.35) + (rootsScore * 0.45) + (specsScore * 0.2);

      return {
        doc: candidate,
        scores: { 
          total: totalScore, 
          vibe: vibeScore, 
          roots: rootsScore, 
          specs: specsScore 
        }
      };
    });

    // 4. Sort by Highest Score & Map to DTO
    return scoredResults
      .sort((a, b) => b.scores.total - a.scores.total) // Descending
      .slice(0, 10) // Top 10 only
      .map(item => new RecommendationResponseDto(item.doc, item.scores));
  }
  /**
   * Calculates similarity between two Vibe Vectors (Manhattan Distance)
   * Returns 0.0 (Opposite) to 1.0 (Identical)
   */
  calculateVibeScore(v1, v2) {
    // Default to neutral (0.5) if data is missing
    const vec1 = v1 || { spiciness: 0.5, price: 0.5, formality: 0.5, noise: 0.5, healthiness: 0.5 };
    const vec2 = v2 || { spiciness: 0.5, price: 0.5, formality: 0.5, noise: 0.5, healthiness: 0.5 };
    
    const keys = ['spiciness', 'price', 'formality', 'noise', 'healthiness'];
    let totalDiff = 0;

    keys.forEach(k => {
      // Handle missing values gracefully
      const val1 = vec1[k] !== undefined ? vec1[k] : 0.5;
      const val2 = vec2[k] !== undefined ? vec2[k] : 0.5;
      totalDiff += Math.abs(val1 - val2);
    });

    // Max possible diff is 5.0 (if all 5 dimensions are 0 vs 1).
    // We invert it so 0 diff = 1.0 score.
    return Math.max(0, 1 - (totalDiff / 5));
  }

  /**
   * Calculates similarity between two Tag Sets (Jaccard Index)
   * Returns 0.0 (No shared tags) to 1.0 (All tags shared)
   */
  calculateSpecsScore(tags1, tags2) {
    if (!tags1?.length || !tags2?.length) return 0;

    const t1 = new Set(tags1);
    const t2 = new Set(tags2);
    
    // Intersection: Count of tags in both sets
    const intersection = [...t1].filter(x => t2.has(x));
    
    // Union: Count of unique tags across both sets
    const union = new Set([...t1, ...t2]);
    
    return intersection.length / union.size;
  }
}

module.exports = new RestaurantService();