// server/middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

const protect = (req, res, next) => {
  let token;

  // Check if the request has an "Authorization: Bearer <token>" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach the user's ID and Role to the request object so the Controller can use it!
      req.user = { id: decoded.id, role: decoded.role };

      // Move to the next function (the Controller)
      next();
    } catch (error) {
      console.error("JWT Verification Failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protect };