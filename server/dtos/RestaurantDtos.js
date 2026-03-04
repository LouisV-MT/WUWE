class RestaurantResponseDto {
  constructor(doc) {
    
    this.id = doc._id;
    
    this.name = doc.name;
    this.location = doc.location; 
   
    this.cuisine = {
      label: doc.cuisine_taxonomy.style || doc.cuisine_taxonomy.sub_region,
      region: doc.cuisine_taxonomy.region
    };

    
    this.vibe = doc.vibe_vector;
    
   
    this.rating = doc.rating_stats?.average || 0;
    this.reviews = doc.rating_stats?.count || 0;
    this.tags = doc.amenities_tags || [];
  }
}

class RecommendationResponseDto extends RestaurantResponseDto {
  constructor(doc, scores) {
    super(doc); 
    this.match_score = parseInt(scores.total * 100); 
    this.match_details = scores;
  }
}

module.exports = { RestaurantResponseDto, RecommendationResponseDto };