// server/services/EnrichmentService.js
const axios = require('axios');
const OpenAI = require("openai");
const Restaurant = require('../models/Restaurant');
const { AiAnalysisResultDto } = require('../dtos/EnrichmentDtos');

class EnrichmentService {
  constructor() {
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  /**
   * Main Workflow
   */
  async enrichRestaurant(id, forceUpdate) {
    // 1. Fetch from DB
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");

    // 2. Resource Lock (Don't waste credits if done)
    if (restaurant.is_enriched && !forceUpdate) {
      return { 
        restaurant, 
        batchStats: { modifiedCount: 0, reason: "Already enriched" } 
      };
    }

    // 3. Get Real Data from Google
    const { realPlaceId, reviews, details } = await this.fetchGoogleDetails(restaurant);

    // 4. Send to Trinity (AI)
    const aiResult = await this.callAiAgent(restaurant, reviews);

    // 5. Update the "Leader" Restaurant
    const updatedRestaurant = await this.updateLeader(restaurant, realPlaceId, details, aiResult);

    // 6. Ripple Effect (Update neighbors)
    const batchStats = await this.propagateVibe(updatedRestaurant);

    return { restaurant: updatedRestaurant, batchStats };
  }

  // --- PRIVATE HELPERS ---

  async fetchGoogleDetails(restaurant) {
    // Search by Name + Address
    const query = `${restaurant.name} ${restaurant.location.address.street} Montreal`;
    console.log(`🔍 Service: Searching Google for "${query}"`);

    // A. Text Search (Get ID)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_MAPS_KEY}`;
    const searchRes = await axios.get(searchUrl);
    
    if (!searchRes.data.results?.length) throw new Error("Google Maps place not found");
    const realPlaceId = searchRes.data.results[0].place_id;

    // B. Details Fetch (Get Reviews)
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${realPlaceId}&fields=reviews,website,rating,user_ratings_total&key=${process.env.GOOGLE_MAPS_KEY}`;
    const detailsRes = await axios.get(detailsUrl);
    
    return {
      realPlaceId,
      reviews: detailsRes.data.result.reviews || [],
      details: detailsRes.data.result
    };
  }

  async callAiAgent(restaurant, reviews) {
    const reviewTexts = reviews.map(r => r.text).slice(0, 10); 
    
    const prompt = `
      You are a data extraction API. Analyze these reviews for a restaurant named "${restaurant.name}" (Current Category: ${restaurant.cuisine_taxonomy.sub_region}).
      
      REVIEWS:
      ${JSON.stringify(reviewTexts)}

      TASK:
      1. Determine the "Vibe" (0.0 to 1.0).
      2. Verify the Category. If "general" or wrong, suggest a correction.

      OUTPUT FORMAT (JSON ONLY):
      {
        "vibe": { 
          "spiciness": 0.0-1.0, 
          "price": 0.0-1.0 (0=Cheap, 1=Expensive), 
          "formality": 0.0-1.0 (0=Casual, 1=Fancy), 
          "noise": 0.0-1.0 (0=Quiet, 1=Loud), 
          "healthiness": 0.0-1.0 
        },
        "tags": ["romantic", "wifi", "patio", "good_for_groups", "late_night"],
        "taxonomy_correction": { "region": "...", "sub_region": "..." } (OR null)
      }
    `;

    // Call OpenRouter with Trinity
    const completion = await this.openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free", 
      messages: [ 
        { role: "system", content: "Output valid JSON only. Do not include markdown formatting or explanations." }, 
        { role: "user", content: prompt } 
      ],
      temperature: 0.2 // Low temp for more consistent JSON
    });

    // Parse Response (Clean up if AI adds markdown)
    let rawText = completion.choices[0].message.content;
    rawText = rawText.replace(/```json|```/g, '').trim();
    
    try {
      const json = JSON.parse(rawText);
      return new AiAnalysisResultDto(json);
    } catch (e) {
      console.error("❌ AI JSON Parse Error. Raw output:", rawText);
      throw new Error("AI failed to return valid JSON");
    }
  }

  async updateLeader(restaurant, placeId, googleDetails, aiData) {
    restaurant.google_place_id = placeId;
    restaurant.vibe_vector = aiData.vibe;
    restaurant.amenities_tags = aiData.tags;
    
    // Update Stats
    restaurant.rating_stats = { 
      average: googleDetails.rating, 
      count: googleDetails.user_ratings_total 
    };

    // Apply Taxonomy Fix
    if (aiData.taxonomy_correction) {
      restaurant.cuisine_taxonomy.region = aiData.taxonomy_correction.region.toLowerCase().replace(/ /g, '_');
      restaurant.cuisine_taxonomy.sub_region = aiData.taxonomy_correction.sub_region.toLowerCase().replace(/ /g, '_');
    }

    restaurant.is_enriched = true;
    restaurant.enrichment_source = "ai_individual";
    restaurant.last_enriched = new Date();
    
    return await restaurant.save();
  }

  async propagateVibe(leader) {
    const targetSubRegion = leader.cuisine_taxonomy.sub_region;
    const result = await Restaurant.updateMany(
      { 
        "cuisine_taxonomy.sub_region": targetSubRegion, 
        is_enriched: false 
      },
      { 
        $set: {
          vibe_vector: leader.vibe_vector, 
          is_enriched: true,
          enrichment_source: "ai_batch_proxy",
          last_enriched: new Date()
        }
      }
    );
    
    console.log(`🌊 Service: Propagated "${targetSubRegion}" baseline to ${result.modifiedCount} peers.`);
    return result;
  }
}

module.exports = new EnrichmentService();