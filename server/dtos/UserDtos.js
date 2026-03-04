class UserProfileDto {
  constructor(userDoc) {
    this.id = userDoc._id;
    this.username = userDoc.username;
    this.email = userDoc.email;
    this.avatar_url = userDoc.avatar_url;
    this.role = userDoc.role;
    
    
    this.budget = userDoc.budget || { min: 0, max: 100 };
    this.preferences = userDoc.preferences || {
      liked_regions: [],
      disliked_tags: [],
      dietary: { is_vegan: false, is_gluten_free: false },
      vibe_target: { spiciness: 0.5, price: 0.5, formality: 0.5, noise: 0.5, healthiness: 0.5 }
    };
    this.saved_restaurants_count = userDoc.saved_restaurants?.length || 0;
  }
}

class VisitJournalDto {
  constructor(visitDoc) {
    this.id = visitDoc._id;
    this.date = visitDoc.date;
    this.total_spent = visitDoc.total_spent;
    this.rating = visitDoc.rating;
    this.private_note = visitDoc.private_note;
    this.my_vibe_score = visitDoc.my_vibe_score;
    
    if (visitDoc.restaurant_id && visitDoc.restaurant_id.name) {
      this.restaurant = {
        id: visitDoc.restaurant_id._id,
        name: visitDoc.restaurant_id.name,
        address: visitDoc.restaurant_id.location?.address?.street
      };
    } else {
      this.restaurant = { id: visitDoc.restaurant_id };
    }
    
    this.items_ordered = visitDoc.items_ordered || [];
  }
}

class AuthResponseDto {
  constructor(userDoc, token) {
    this.user = new UserProfileDto(userDoc);
    this.token = token; 
  }
}

module.exports = { UserProfileDto, VisitJournalDto, AuthResponseDto };