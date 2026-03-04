const userRepo = require('../repositories/UserRepository');
const { UserProfileDto, VisitJournalDto } = require('../dtos/UserDtos');

class UserService {

  async getUserProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    
    return new UserProfileDto(user);
  }

  async getUserJournal(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    
    return user.history.map(visit => new VisitJournalDto(visit));
  }

  async updatePreferences(userId, prefsData) {
    const updatedUser = await userRepo.updatePreferences(userId, prefsData);
    if (!updatedUser) throw new Error("Failed to update preferences");
    
    return new UserProfileDto(updatedUser);
  }

  async addJournalEntry(userId, visitData) {
    const updatedUser = await userRepo.addVisitToHistory(userId, visitData);
    if (!updatedUser) throw new Error("Failed to add journal entry");
    
    
    const newEntry = updatedUser.history[updatedUser.history.length - 1];
    return new VisitJournalDto(newEntry);
  }

  async toggleSavedRestaurant(userId, restaurantId, action) {
    let updatedUser;
    if (action === 'save') {
      updatedUser = await userRepo.addSavedRestaurant(userId, restaurantId);
    } else if (action === 'remove') {
      updatedUser = await userRepo.removeSavedRestaurant(userId, restaurantId);
    }
    return new UserProfileDto(updatedUser);
  }
}

module.exports = new UserService();