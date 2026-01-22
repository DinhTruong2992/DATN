const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../assets')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/auth', authRoutes);

// Page Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    const message = req.query.registered ? {
        type: 'success',
        text: 'Registration successful! Please login.'
    } : null;
    
    res.render('login', { message });
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Dashboard route (protected - example)
app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container">
                    <a class="navbar-brand" href="#">Auth App</a>
                    <div class="navbar-nav ms-auto">
                        <a class="nav-link" href="/login">Logout</a>
                    </div>
                </div>
            </nav>
            <div class="container mt-5">
                <h1>Welcome to Dashboard</h1>
                <p>This is a protected page.</p>
                <a href="/login" class="btn btn-secondary">Go to Login</a>
            </div>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;
// Thêm route này vào file src/app.js, sau phần middleware

// Splash screen route
app.get('/splash', (req, res) => {
    res.render('splash');
});

// Chuyển hướng root đến splash screen
app.get('/', (req, res) => {
    res.redirect('/splash');
});

// Page Routes (giữ nguyên các route cũ)
app.get('/login', (req, res) => {
    const message = req.query.registered ? {
        type: 'success',
        text: 'Registration successful! Please login.'
    } : req.query.error ? {
        type: 'danger',
        text: decodeURIComponent(req.query.error)
    } : null;
    
    res.render('login', { message });
});

app.get('/register', (req, res) => {
    const message = req.query.error ? {
        type: 'danger',
        text: decodeURIComponent(req.query.error)
    } : null;
    
    res.render('register', { message });
});