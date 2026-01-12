const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validatePassword, checkDuplicateUser } = require('../middlewares/authMiddleware');

// Validation middleware for registration
const validateRegistration = (req, res, next) => {
    const { username, email, password, phoneNumber } = req.body;
    
    if (!username || !email || !password || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    
    next();
};

// Register route
router.post('/register', 
    validateRegistration,
    validatePassword,
    checkDuplicateUser,
    registerUser
);

// Login route
router.post('/login', loginUser);

module.exports = router;