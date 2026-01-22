// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        config.jwt.secret || 'demo_secret_key',
        { expiresIn: config.jwt.expiresIn || '24h' }
    );
};

// Register new user
const register = async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        
        let user;
        
        // Demo mode
        if (config.app.demoMode) {
            // Tạo user demo
            user = {
                _id: `demo_${Date.now()}`,
                username,
                email: email.toLowerCase(),
                password, // Trong thực tế phải hash
                phoneNumber,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            console.log('✅ Demo user created:', username);
            
            // Thêm vào demo users nếu có
            if (config.demo && config.demo.users) {
                config.demo.users.push(user);
            }
        } else {
            // Production mode
            user = new User({
                username,
                email: email.toLowerCase(),
                password,
                phoneNumber
            });
            await user.save();
        }
        
        const token = generateToken(user._id || user.username);
        
        const responseMessage = config.app.demoMode 
            ? (config.demo.responses ? config.demo.responses.register : 'User registered (DEMO MODE)')
            : 'User registered successfully';
        
        res.status(201).json({
            success: true,
            message: responseMessage,
            data: {
                user: {
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                },
                token
            }
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
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error registering user'
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        let user;
        
        // Demo mode
        if (config.app.demoMode) {
            // Kiểm tra trong demo users
            const demoUsers = config.demo && config.demo.users ? config.demo.users : [];
            const demoUser = demoUsers.find(
                u => u.username === username || u.email === username
            );
            
            if (!demoUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials. Try demo/Demo@123 or test/Test@123'
                });
            }
            
            // Demo passwords
            const demoPasswords = ['Demo@123', 'Test@123', 'Admin@123'];
            if (!demoPasswords.includes(password)) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            user = {
                _id: demoUser._id || `demo_${demoUser.username}`,
                username: demoUser.username,
                email: demoUser.email,
                phoneNumber: demoUser.phoneNumber
            };
        } else {
            // Production mode
            user = await User.findOne({
                $or: [
                    { username: username },
                    { email: username.toLowerCase() }
                ]
            });
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }
        
        const token = generateToken(user._id);
        const responseMessage = config.app.demoMode 
            ? (config.demo.responses ? config.demo.responses.login : 'Login successful (DEMO MODE)')
            : 'Login successful';
        
        res.status(200).json({
            success: true,
            message: responseMessage,
            data: {
                user: {
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                },
                token
            }
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
    register,
    login
};