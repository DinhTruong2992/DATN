// src/config/database.js - Demo mode (không cần MongoDB)
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {
        if (process.env.DEMO_MODE === 'true') {
            console.log('📱 Running in DEMO MODE (no database required)');
            isConnected = true;
            return;
        }
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        isConnected = true;
        return conn;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️  Running without database (DEMO MODE)');
            console.log('ℹ️  To enable database, set DEMO_MODE=false and ensure MongoDB is running');
            isConnected = false;
            return;
        }
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const checkConnection = () => {
    return isConnected;
};

module.exports = { connectDB, checkConnection };