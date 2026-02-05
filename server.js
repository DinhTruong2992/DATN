// server.js - Main entry point
require('dotenv').config();

console.log('\n' + '='.repeat(60));
console.log('🚀 DATN E-commerce Application');
console.log('='.repeat(60));
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📊 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
console.log(`🏠 Host: ${process.env.HOST || 'localhost'}`);
console.log(`🚪 Port: ${process.env.PORT || 3000}`);
console.log('='.repeat(60) + '\n');

// Check critical environment variables
const requiredEnvVars = ['JWT_SECRET', 'SESSION_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Please check your .env file');
    process.exit(1);
}

// Import the app
const app = require('./app');

// Get port from environment or use default
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Server is running on http://${HOST}:${PORT}`);
    console.log(`📚 API Documentation: http://${HOST}:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://${HOST}:${PORT}/health`);
    console.log(`📊 Status Page: http://${HOST}:${PORT}/status`);
    
    // Log database status
    const database = require('./src/config/database');
    console.log(`💾 Database: ${database.isDemo() ? 'DEMO MODE' : 'PRODUCTION'}`);
    console.log(`🔗 Connected: ${database.checkConnection() ? 'YES' : 'NO'}`);
    console.log('\n' + '📖 Available Routes:'.padEnd(30) + 'Description');
    console.log('-'.repeat(60));
    console.log(`  /`.padEnd(30) + '→ Home page');
    console.log(`  /splash`.padEnd(30) + '→ Splash page');
    console.log(`  /login`.padEnd(30) + '→ Login page');
    console.log(`  /register`.padEnd(30) + '→ Register page');
    console.log(`  /shop`.padEnd(30) + '→ Shop page');
    console.log(`  /cart`.padEnd(30) + '→ Cart page');
    console.log(`  /profile`.padEnd(30) + '→ Profile page');
    console.log(`  /payment`.padEnd(30) + '→ Payment page');
    console.log(`  /api/auth/*`.padEnd(30) + '→ Authentication API');
    console.log('-'.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = server;