// server/models/Restaurant.js
const mongoose = require('mongoose');

// 1. Sub-Schema for Menu Items
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  dietary_tags: {
    is_vegan: { type: Boolean, default: false },
    is_gluten_free: { type: Boolean, default: false }
  },
  is_available: { type: Boolean, default: true }
});

// 2. Sub-Schema for Video Reviews (The "TikTok/Shorts" feature)
const VideoReviewSchema = new mongoose.Schema({
  platform: { type: String, enum: ['youtube', 'tiktok', 'instagram'], required: true },
  video_id: { type: String, required: true }, // e.g., "dQw4w9WgXcQ"
  thumbnail_url: String,
  author_name: String,
  video_url: String, // Full link
  is_curated: { type: Boolean, default: false } // True if manually added by admin
});

// 3. Main Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
  // --- CORE INFO ---
  name: { type: String, required: true },
  google_place_id: { type: String, unique: true },
  
  // Note: '2dsphere' index is critical for the $near geospatial queries
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, 
    address: { street: String, city: String, province: String }
  },

  cuisine_taxonomy: {
    region: String,
    sub_region: String,
    style: String
  },

  // --- THE AI VIBE ENGINE ---
  vibe_vector: {
    spiciness: { type: Number, default: 0.1 },
    price:     { type: Number, default: 0.5 },
    formality: { type: Number, default: 0.5 },
    noise:     { type: Number, default: 0.5 },
    healthiness:{ type: Number,default: 0.5 }
  },
  amenities_tags: [{ type: String, index: true }], 

  // --- ENRICHMENT METADATA ---
  is_enriched: { type: Boolean, default: false, index: true },
  enrichment_source: { type: String, default: "manual_import" }, // "manual_import", "ai_individual", "ai_batch_proxy"
  vibe_vote_count: { type: Number, default: 0 }, // For crowdsourcing
  last_enriched: { type: Date, default: null },

  // --- RICH MEDIA & STATS ---
  menu: [MenuItemSchema],
  video_reviews: [VideoReviewSchema], // Integrated the video feeds
  rating_stats: { 
    average: { type: Number, default: 0 }, 
    count: { type: Number, default: 0 } 
  },
  website: String,

}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);