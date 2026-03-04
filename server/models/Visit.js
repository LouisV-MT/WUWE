const mongoose = require('mongoose');


const OrderedItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant.menu' },
  item_name: String, 
  quantity: { type: Number, default: 1 }
});

const VisitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  establishment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  
  visit_date: { type: Date, default: Date.now },
 
  total_spent: { type: Number, default: 0 },
  number_of_people: { type: Number, default: 1 },
  is_favorite: { type: Boolean, default: false },

  star_rating: { type: Number, min: 1, max: 5 },
  review_comment: String,
  
  items_ordered: [OrderedItemSchema]

}, { timestamps: true });

module.exports = mongoose.model('Visit', VisitSchema);