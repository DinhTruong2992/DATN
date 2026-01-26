const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

/* =======================
   DATABASE
======================= */
connectDB();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static(path.join(__dirname, '../assets')));

/* =======================
   VIEW ENGINE
======================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =======================
   API ROUTES
======================= */
app.use('/api/auth', authRoutes);

/* =======================
   PAGE ROUTES
======================= */

// Splash
app.get('/', (req, res) => {
    res.redirect('/splash');
});

app.get('/splash', (req, res) => {
    res.render('splash');
});

// Auth pages
app.get('/login', (req, res) => {
    const message = req.query.registered
        ? { type: 'success', text: 'Registration successful! Please login.' }
        : req.query.error
        ? { type: 'danger', text: decodeURIComponent(req.query.error) }
        : null;

    res.render('login', { message });
});

app.get('/register', (req, res) => {
    const message = req.query.error
        ? { type: 'danger', text: decodeURIComponent(req.query.error) }
        : null;

    res.render('register', { message });
});

app.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword');
});

// Shop
app.get('/shop', (req, res) => {
    res.render('shop', { active: 'shop' });
});

app.get('/product/:id', (req, res) => {
    // MOCK – sau này lấy từ MongoDB
    const product = {
        _id: req.params.id,
        name: 'Robot biến hình',
        price: 350000,
        description: 'Robot biến hình thông minh cho trẻ em.',
        images: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        category: 'Robot'
    };

    res.render('product-detail', { product, active: 'shop' });
});

app.get('/favorite', (req, res) => {
    res.render('favorite', { active: 'favorite' });
});

app.get('/cart', (req, res) => {
    res.render('cart', { active: 'cart' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { active: 'profile' });
});

/* =======================
   HEALTH CHECK
======================= */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        time: new Date().toISOString()
    });
});

/* =======================
   ERROR HANDLING
======================= */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;
