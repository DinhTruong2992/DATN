// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register route
router.post('/register',
    authMiddleware.validateRegistration,
    authMiddleware.validatePassword,
    authMiddleware.checkDuplicateUser,
    authController.register
);

// Login route
router.post('/login',
    authMiddleware.validateLogin,
    authController.login
);

// Demo info endpoint
router.get('/demo-info', (req, res) => {
    res.json({
        success: true,
        message: 'Running in DEMO MODE - No database required',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            demoUsers: 'GET /api/auth/demo-users'
        },
        demoCredentials: [
            { username: 'demo', password: 'Demo@123', email: 'demo@example.com' },
            { username: 'test', password: 'Test@123', email: 'test@example.com' }
        ]
    });
});

// Get demo users
router.get('/demo-users', authController.getDemoUsers);

module.exports = router;