class EnrichmentRequestDto {
  constructor(params, query) {
    this.id = params.id;
    this.force = query.force === 'true';
  }
}

class AiAnalysisResultDto {
  constructor(aiJson) {
    this.vibe = {
      spiciness: aiJson.vibe?.spiciness || 0.1,
      price: aiJson.vibe?.price || 0.5,
      formality: aiJson.vibe?.formality || 0.5,
      noise: aiJson.vibe?.noise || 0.5,
      healthiness: aiJson.vibe?.healthiness || 0.5
    };
    this.tags = Array.isArray(aiJson.tags) ? aiJson.tags : [];
    this.taxonomy_correction = aiJson.taxonomy_correction || null;
  }
}

class EnrichmentResponseDto {
  constructor(restaurant, batchStats) {
    this.leader_data = {
      name: restaurant.name,
      vibe: restaurant.vibe_vector,
      tags: restaurant.amenities_tags,
      taxonomy: restaurant.cuisine_taxonomy
    };
    this.batch_stats = {
      peers_updated: batchStats?.modifiedCount || 0,
      target_region: restaurant.cuisine_taxonomy.sub_region
    };
    this.message = "Enrichment and batch propagation successful.";
  }
}

module.exports = { EnrichmentRequestDto, AiAnalysisResultDto, EnrichmentResponseDto };