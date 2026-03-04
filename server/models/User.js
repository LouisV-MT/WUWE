const mongoose = require('mongoose');

// 1. What the user ate
const EatenItemSchema = new mongoose.Schema({
  item_name: String, 
  quantity: { type: Number, default: 1 },
  price_at_time: Number
});

// 2. The Visit Journal
const VisitSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  date: { type: Date, default: Date.now },
  total_spent: Number,
  items_ordered: [EatenItemSchema],
  
  rating: { type: Number, min: 1, max: 5 },
  private_note: { type: String, maxlength: 500 },
  
  // How the user perceived the vibe (can be compared to the global AI vibe later!)
  my_vibe_score: {
    spiciness: Number,
    price: Number,
    formality: Number,
    noise: Number,
    healthiness: Number
  },
  is_shared: { type: Boolean, default: false }
});

// 3. The Main User
const UserSchema = new mongoose.Schema({
  // --- AUTHENTICATION (Supports Local & Google) ---
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // False so Google users can log in without it
  google_id: { type: String, required: false, unique: true, sparse: true },
  
  // --- PROFILE ---
  avatar_url: { type: String, default: "" },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 }
  },

  // --- PREFERENCES (For Recommendation Engine) ---
  preferences: {
    liked_regions: [String], 
    disliked_tags: [String], 
    dietary: {
      is_vegan: { type: Boolean, default: false },
      is_gluten_free: { type: Boolean, default: false }
    },
    // The AI Vector matching
    vibe_target: {
      spiciness: { type: Number, default: 0.5 },
      price:     { type: Number, default: 0.5 },
      formality: { type: Number, default: 0.5 },
      noise:     { type: Number, default: 0.5 },
      healthiness:{ type: Number, default: 0.5 }
    }
  },

  // --- DATA ---
  saved_restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }], // Bookmarks
  history: [VisitSchema] // The Journal

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);