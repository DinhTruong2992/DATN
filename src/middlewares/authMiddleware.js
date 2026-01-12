// Password validation middleware
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be 8-16 characters, contain at least one uppercase letter and one special character'
        });
    }
    next();
};

// Check if user exists
const checkDuplicateUser = async (req, res, next) => {
    const { username, email, phoneNumber } = req.body;
    
    try {
        const User = require('../models/User');
        
        // Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        // Check for existing phone number
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    validatePassword,
    checkDuplicateUser
};