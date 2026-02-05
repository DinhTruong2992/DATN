// src/config/database.js
const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.isDemoMode = process.env.DEMO_MODE === 'true';
        this.mockData = null;
    }

    async connect() {
        try {
            console.log('🚀 Initializing Database...');
            
            // DEMO MODE: Không cần database thật
            if (this.isDemoMode) {
                console.log('📱 DEMO MODE ENABLED');
                console.log('💾 Using in-memory mock data');
                console.log('ℹ️  To use real database, set DEMO_MODE=false in .env');
                
                this.isConnected = true;
                this.mockData = this.initializeMockData();
                return this.mockData;
            }

            // PRODUCTION: Kết nối MongoDB thật
            const mongoURI = process.env.MONGODB_URI;
            
            if (!mongoURI) {
                console.error('❌ MONGODB_URI is not defined in environment variables');
                console.log('🔄 Falling back to DEMO MODE');
                return this.fallbackToDemo();
            }

            // Hiển thị URI an toàn (ẩn password)
            const safeURI = this.getSafeURI(mongoURI);
            console.log(`🔗 Connecting to MongoDB: ${safeURI}`);

            // Kết nối với timeout
            this.connection = await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,  // 5 giây timeout
                socketTimeoutMS: 45000,          // 45 giây socket timeout
                maxPoolSize: 10,                 // Connection pool
            });

            this.isConnected = true;
            console.log(`✅ MongoDB Connected Successfully!`);
            console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
            console.log(`🎯 Host: ${mongoose.connection.host}`);
            console.log(`📈 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

            // Thiết lập event listeners
            this.setupEventListeners();
            
            return this.connection;

        } catch (error) {
            console.error(`❌ Database Connection Failed: ${error.message}`);
            console.log('🔄 Falling back to DEMO MODE');
            
            return this.fallbackToDemo();
        }
    }

    // Hiển thị URI an toàn (ẩn password)
    getSafeURI(uri) {
        try {
            return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
        } catch {
            return 'mongodb://****:****@****';
        }
    }

    // Fallback về demo mode
    fallbackToDemo() {
        this.isDemoMode = true;
        this.isConnected = true;
        this.mockData = this.initializeMockData();
        
        console.log('📱 Now running in DEMO MODE');
        console.log('📊 Mock data initialized');
        
        return this.mockData;
    }

    // Khởi tạo mock data - SỬA LỖI circular reference
    initializeMockData() {
        // Tạo mock data object
        const mockUsers = [
            {
                _id: 'demo_user_1',
                username: 'demo_user',
                email: 'demo@example.com',
                password: '$2a$10$demoHash', // bcrypt hash của "password123"
                phoneNumber: '0901234567',
                role: 'user',
                createdAt: new Date()
            },
            {
                _id: 'demo_admin_1',
                username: 'admin',
                email: 'admin@example.com',
                password: '$2a$10$demoAdminHash',
                phoneNumber: '0907654321',
                role: 'admin',
                createdAt: new Date()
            }
        ];
        
        const mockProducts = [
            {
                _id: 'prod_1',
                name: 'Nike Air Max 270',
                price: 129.99,
                category: 'Shoes',
                image: '/assets/images/products/nike_airmax.jpg',
                description: 'Comfortable running shoes',
                stock: 50,
                createdAt: new Date()
            },
            {
                _id: 'prod_2',
                name: 'Nike Dri-FIT T-Shirt',
                price: 29.99,
                category: 'Apparel',
                image: '/assets/images/products/nike_tshirt.jpg',
                description: 'Moisture-wicking fabric',
                stock: 100,
                createdAt: new Date()
            },
            {
                _id: 'prod_3',
                name: 'Nike Running Shorts',
                price: 39.99,
                category: 'Apparel',
                image: '/assets/images/products/nike_shorts.jpg',
                description: 'Lightweight running shorts',
                stock: 75,
                createdAt: new Date()
            },
            {
                _id: 'prod_4',
                name: 'Nike Backpack',
                price: 59.99,
                category: 'Accessories',
                image: '/assets/images/products/nike_backpack.jpg',
                description: 'Durable sports backpack',
                stock: 30,
                createdAt: new Date()
            }
        ];
        
        const mockOrders = [
            {
                _id: 'order_1',
                userId: 'demo_user_1',
                items: [
                    { 
                        productId: 'prod_1', 
                        productName: 'Nike Air Max 270',
                        quantity: 2, 
                        price: 129.99 
                    }
                ],
                total: 259.98,
                status: 'completed',
                paymentMethod: 'momo',
                createdAt: new Date('2024-01-15')
            },
            {
                _id: 'order_2',
                userId: 'demo_user_1',
                items: [
                    { 
                        productId: 'prod_2', 
                        productName: 'Nike Dri-FIT T-Shirt',
                        quantity: 1, 
                        price: 29.99 
                    },
                    { 
                        productId: 'prod_3', 
                        productName: 'Nike Running Shorts',
                        quantity: 1, 
                        price: 39.99 
                    }
                ],
                total: 69.98,
                status: 'pending',
                paymentMethod: 'bank',
                createdAt: new Date('2024-02-01')
            }
        ];

        // Trả về object với methods
        return {
            // Data
            users: mockUsers,
            products: mockProducts,
            orders: mockOrders,
            
            // Methods để query mock data
            findUserByEmail: (email) => {
                return mockUsers.find(user => user.email === email);
            },
            
            findUserById: (id) => {
                return mockUsers.find(user => user._id === id);
            },
            
            findProductById: (id) => {
                return mockProducts.find(product => product._id === id);
            },
            
            getAllProducts: () => {
                return mockProducts;
            },
            
            getProductsByCategory: (category) => {
                return mockProducts.filter(product => product.category === category);
            },
            
            findOrdersByUserId: (userId) => {
                return mockOrders.filter(order => order.userId === userId);
            },
            
            addUser: (userData) => {
                const newUser = {
                    _id: `demo_user_${mockUsers.length + 1}`,
                    ...userData,
                    createdAt: new Date()
                };
                mockUsers.push(newUser);
                return newUser;
            },
            
            addOrder: (orderData) => {
                const newOrder = {
                    _id: `order_${mockOrders.length + 1}`,
                    ...orderData,
                    createdAt: new Date()
                };
                mockOrders.push(newOrder);
                return newOrder;
            },
            
            updateProductStock: (productId, quantity) => {
                const product = mockProducts.find(p => p._id === productId);
                if (product) {
                    product.stock -= quantity;
                    return product;
                }
                return null;
            },
            
            // Statistics
            getStats: () => {
                return {
                    totalUsers: mockUsers.length,
                    totalProducts: mockProducts.length,
                    totalOrders: mockOrders.length,
                    totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0)
                };
            }
        };
    }

    // Thiết lập event listeners cho MongoDB
    setupEventListeners() {
        if (!this.connection) return;

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            this.isConnected = true;
        });

        mongoose.connection.on('connecting', () => {
            console.log('🔗 Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected');
            this.isConnected = true;
        });
    }

    // Kiểm tra kết nối
    checkConnection() {
        if (this.isDemoMode) {
            return this.isConnected; // Luôn true trong demo mode
        }
        return mongoose.connection.readyState === 1;
    }

    // Lấy connection
    getConnection() {
        if (this.isDemoMode) {
            return {
                demo: true,
                data: this.mockData,
                isDemoMode: true
            };
        }
        
        if (this.checkConnection()) {
            return mongoose.connection;
        }
        
        return null;
    }

    // Lấy mock data methods
    getDB() {
        if (this.isDemoMode && this.mockData) {
            return this.mockData;
        }
        return null;
    }

    // Ngắt kết nối
    async disconnect() {
        if (this.isDemoMode) {
            console.log('🔌 Demo mode - nothing to disconnect');
            return;
        }
        
        if (this.connection) {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('🔌 MongoDB Disconnected');
        }
    }

    // Kiểm tra có đang chạy demo không
    isDemo() {
        return this.isDemoMode;
    }

    // Lấy mock data (nếu đang demo)
    getMockData() {
        return this.mockData;
    }
}

// Export singleton instance
module.exports = new Database();