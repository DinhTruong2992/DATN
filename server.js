// server.js - kiểm tra nội dung
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`
    🚀  Server is running!
    📍  Port: ${PORT}
    🌐  Local: http://localhost:${PORT}
    🔐  Login: http://localhost:${PORT}/login
    📝  Register: http://localhost:${PORT}/register
    🏥  Health: http://localhost:${PORT}/health
    📊  Database: ${process.env.MONGODB_URI}
    `);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});