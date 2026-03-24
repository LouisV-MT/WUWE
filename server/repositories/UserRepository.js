const User = require('../models/User');

class UserRepository {
  
  // --- AUTH & READ ---
  async findById(id) {
    // Exclude password for safety, but populate the history's restaurant names
    return await User.findById(id)
      .select('-password')
      .populate('history.restaurant_id', 'name location.address.street images');
  }

  async findByEmail(email) {
    return await User.findOne({ email }); // Used for login (needs password field)
  }

  async findByGoogleId(googleId) {
    return await User.findOne({ google_id: googleId });
  }

  // --- CREATE & UPDATE ---
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updatePreferences(userId, prefsData) {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "preferences.liked_regions": prefsData.liked_regions,
        "preferences.dietary.is_vegan": prefsData.dietary?.includes("vegan"),
        "preferences.dietary.is_vegetarian": prefsData.dietary?.includes("vegetarian"),
        "preferences.dietary.is_gluten_free": prefsData.dietary?.includes("gluten-free"),
        "preferences.vibe_target": prefsData.vibeTarget,
        "budget": prefsData.budget,
      }
    },
    { new: true, runValidators: true }
  );
}

  // --- BOOKMARKS ---
  async addSavedRestaurant(userId, restaurantId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { saved_restaurants: restaurantId } }, 
      { new: true }
    );
  }

  async removeSavedRestaurant(userId, restaurantId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { saved_restaurants: restaurantId } },
      { new: true }
    );
  }

  // --- THE JOURNAL (VISITS) ---
  async addVisitToHistory(userId, visitData) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { history: visitData } },
      { new: true }
    ).select('-password');
  }
}

module.exports = new UserRepository();