const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        
        // Create new user
        const user = new User({
            username,
            email,
            password,
            phoneNumber
        });
        
        await user.save();
        
        // Return success response (excluding password)
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userResponse
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user by username or email
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Return user data (excluding password)
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userResponse
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};