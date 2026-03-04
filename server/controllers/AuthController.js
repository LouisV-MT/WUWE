const authService = require('../services/AuthService');

class AuthController {

  // POST /api/auth/register
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }

      const responseDto = await authService.registerLocalUser(username, email, password);
      res.status(201).json(responseDto);

    } catch (err) {
      console.error("Registration Error:", err.message);
      if (err.message === "Email already in use") {
        return res.status(409).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const responseDto = await authService.loginLocalUser(email, password);
      res.status(200).json(responseDto);

    } catch (err) {
      console.error("Login Error:", err.message);
      if (err.message === "Invalid credentials" || err.message === "Please log in with Google") {
        return res.status(401).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to log in" });
    }
  }

  // POST /api/auth/google
  async googleLogin(req, res) {
    try {
      // The frontend will send the Google Profile object they get from the Google SDK
      const googleProfile = req.body; 

      if (!googleProfile || !googleProfile.googleId) {
        return res.status(400).json({ error: "Invalid Google profile data" });
      }

      const responseDto = await authService.handleGoogleLogin(googleProfile);
      res.status(200).json(responseDto);

    } catch (err) {
      console.error("Google Auth Error:", err.message);
      res.status(500).json({ error: "Failed to authenticate with Google" });
    }
  }
}

module.exports = new AuthController();