const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Usage: POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// Usage: POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

// Usage: POST /api/auth/google
router.post('/google', (req, res) => authController.googleLogin(req, res));

module.exports = router;