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

app.use('/img', express.static('img'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));



// Set view engine for EJS (optional - for server-side rendering)
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
app.use('/api/auth', authRoutes);

// Render pages

app.get('/home', (req, res) => {
    res.render('home', { active: 'home' });
});

app.get('/shop', (req, res) => {
    res.render('shop', { active: 'shop' });
});

app.get('/productDetail', (req, res) => {
    res.render('productDetail', { active: 'productDetail' });
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

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/product/:id', (req, res) => {
    // MOCK DATA – sau này lấy từ Mongo bằng id
    const product = {
        id: req.params.id,
        name: 'Robot biến hình',
        price: 350000,
        description: 'Robot biến hình thông minh cho trẻ em từ 6 tuổi.',
        images: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        category: 'Robot'
    };

    res.render('product-detail', {
        product,
        active: 'shop'
    });
});


app.get('/login', (req, res) => {
    res.render('login');
});



app.get('/', (req, res) => {
    res.redirect('/register');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
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