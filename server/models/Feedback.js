const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback_text: { type: String, required: true },
  status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);