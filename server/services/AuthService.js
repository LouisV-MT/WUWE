const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/UserRepository');
const { AuthResponseDto } = require('../dtos/UserDtos');

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

class AuthService {

  async registerLocalUser(username, email, plainTextPassword) {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new Error("Email already in use");

    const password_hash = await bcrypt.hash(plainTextPassword, 10);
    
    const newUser = await userRepo.create({
      username,
      email,
      password: password_hash
    });

    const token = this.generateToken(newUser);
    return new AuthResponseDto(newUser, token);
  }

  async loginLocalUser(email, plainTextPassword) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    if (!user.password) throw new Error("Please log in with Google");

    const isMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = this.generateToken(user);
    return new AuthResponseDto(user, token);
  }

  async handleGoogleLogin(googleProfile) {
    const { googleId, email, name, picture } = googleProfile;

    let user = await userRepo.findByGoogleId(googleId);

    if (!user) {
      user = await userRepo.findByEmail(email);
      if (user) {
        user.google_id = googleId;
        if (!user.avatar_url) user.avatar_url = picture;
        await user.save();
      }
    }

    if (!user) {
      user = await userRepo.create({
        username: name,
        email: email,
        google_id: googleId,
        avatar_url: picture
      });
    }

    const token = this.generateToken(user);
    return new AuthResponseDto(user, token);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
  }
}

module.exports = new AuthService();