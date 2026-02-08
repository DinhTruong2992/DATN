const express = require("express");
const session = require("express-session");
const config = require("./config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Database
const database = require("./config/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

/* ======================= STARTUP LOG ======================= */
console.log("\n" + "=".repeat(60));
console.log("🚀 DATN E-COMMERCE APPLICATION");
console.log("=".repeat(60));
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📊 DEMO_MODE: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
console.log(`🎯 Port: ${process.env.PORT || 3000}`);
console.log(`📁 Root: ${__dirname}`);
console.log("=".repeat(60) + "\n");

/* ======================= DATABASE CONNECTION ======================= */
async function initializeDatabase() {
  try {
    const connection = await database.connect();
    
    if (database.isDemo()) {
      console.log("📱 RUNNING IN DEMO MODE");
      console.log("💾 Using in-memory mock data");
      console.log("⚠️  No real database connection");
      console.log("ℹ️  To use real database: set DEMO_MODE=false in .env\n");
    } else {
      console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
      console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
      console.log(`🔗 Host: ${mongoose.connection.host || 'Unknown'}`);
      console.log(`📈 Connection State: ${getConnectionState(mongoose.connection.readyState)}\n`);
      
      // Setup database event listeners
      setupDatabaseListeners();
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.log("🔄 Continuing in DEMO MODE\n");
    database.fallbackToDemo();
  }
}

// Helper để hiển thị trạng thái kết nối
function getConnectionState(state) {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  };
  return states[state] || 'Unknown';
}

// Database event listeners
function setupDatabaseListeners() {
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });
}

initializeDatabase();

/* ======================= MIDDLEWARE ======================= */
app.use(cors({
  origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:5500"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session middleware với config linh hoạt
app.use(session({
  secret: process.env.SESSION_SECRET || config.session?.secret || "datn_ecommerce_secret_key_2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
  },
  name: "datn.sid",
  rolling: true // Renew session on activity
}));

// Middleware để thêm thông tin vào request
app.use((req, res, next) => {
  req.demoMode = database.isDemo();
  req.db = database.getConnection();
  
  // Log request info (chỉ trong development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📨 ${req.method} ${req.path} - Session: ${req.sessionID ? 'Active' : 'None'}`);
  }
  
  next();
});

/* ======================= VIEW ENGINE ======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ======================= GLOBAL VIEW VARIABLES ======================= */
app.use((req, res, next) => {
  // Thêm biến toàn cục cho tất cả views
  res.locals.demoMode = database.isDemo();
  res.locals.env = process.env.NODE_ENV;
  res.locals.active = "";
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cartCount || 0;
  res.locals.currentYear = new Date().getFullYear();
  
  // Helper functions cho order
  res.locals.getStatusText = (status) => {
    const statusMap = {
      'pending': '🔄 Chờ xử lý',
      'processing': '⚙️ Đang xử lý',
      'shipped': '🚚 Đang giao hàng',
      'delivered': '✅ Đã giao',
      'cancelled': '❌ Đã hủy'
    };
    return statusMap[status] || status;
  };
  
  res.locals.getPaymentMethodText = (method) => {
    const methodMap = {
      'cod': '💰 Thanh toán khi nhận hàng',
      'momo': '📱 Ví MoMo',
      'banking': '🏦 Chuyển khoản ngân hàng'
    };
    return methodMap[method] || method;
  };
  
  res.locals.getPaymentStatusText = (status) => {
    const statusMap = {
      'pending': '⏳ Chờ thanh toán',
      'paid': '✅ Đã thanh toán',
      'failed': '❌ Thanh toán thất bại'
    };
    return statusMap[status] || status;
  };
  
  // Format currency
  res.locals.formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  // Format date
  res.locals.formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  next();
});

/* ======================= ROUTES CONFIGURATION ======================= */
// API Routes (JSON responses)
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Page Routes (HTML/EJS responses)
app.use("/", shopRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/", userRoutes); // User profile routes
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes); // Order pages

/* ======================= CORE PAGES ======================= */
// Home redirect
app.get("/", (req, res) => {
  res.redirect("/splash");
});

// Splash/Home page
app.get("/splash", (req, res) => {
  res.render("splash", { 
    active: "home",
    title: "Chào mừng - DATN Shop"
  });
});

// Authentication pages
app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  
  const message = req.query.registered
    ? { type: "success", text: "Đăng ký thành công! Vui lòng đăng nhập." }
    : req.query.error
      ? { type: "danger", text: decodeURIComponent(req.query.error) }
      : null;
    
  res.render("login", { 
    message,
    active: "auth",
    title: "Đăng nhập - DATN Shop"
  });
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  
  const message = req.query.error
    ? { type: "danger", text: decodeURIComponent(req.query.error) }
    : null;
    
  res.render("register", { 
    message,
    active: "auth",
    title: "Đăng ký - DATN Shop"
  });
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", { 
    active: "auth",
    title: "Quên mật khẩu - DATN Shop"
  });
});

// Shop page
app.get("/shop", (req, res) => {
  res.render("shop", { 
    active: "shop",
    title: "Cửa hàng - DATN Shop"
  });
});

// Cart page
app.get("/cart", async (req, res) => {
  try {
    // Nếu là demo mode, dùng session cart
    if (database.isDemo()) {
      const cartItems = req.session.cartItems || [];
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return res.render("cart", {
        active: "cart",
        title: "Giỏ hàng - DATN Shop",
        items: cartItems,
        total: total
      });
    }
    
    // Production: lấy cart từ database
    if (req.session.user) {
      const Cart = require('./models/Cart');
      const cart = await Cart.findOne({ user: req.session.user._id })
        .populate('items.product');
      
      const items = cart ? cart.items : [];
      const total = items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0);
      
      return res.render("cart", {
        active: "cart",
        title: "Giỏ hàng - DATN Shop",
        items: items,
        total: total
      });
    }
    
    // Chưa đăng nhập
    res.render("cart", {
      active: "cart",
      title: "Giỏ hàng - DATN Shop",
      items: [],
      total: 0
    });
    
  } catch (error) {
    console.error("Error loading cart page:", error);
    res.render("cart", {
      active: "cart",
      title: "Giỏ hàng - DATN Shop",
      items: [],
      total: 0,
      error: "Không thể tải giỏ hàng"
    });
  }
});

// Checkout page
app.get("/checkout", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login?redirect=/checkout&message=Vui lòng đăng nhập để thanh toán");
  }
  
  // Check if cart is empty
  if (req.session.cartCount === 0 || !req.session.cartCount) {
    return res.redirect("/cart?message=Giỏ hàng trống");
  }
  
  res.render("checkout", {
    active: "cart",
    title: "Thanh toán - DATN Shop",
    user: req.session.user
  });
});

// Orders page - sửa lại để dùng controller
app.get("/my-orders", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login?redirect=/my-orders");
  }
  
  try {
    // Trong demo mode, dùng mock data
    if (database.isDemo()) {
      const demoOrders = [
        {
          _id: "order_001",
          orderNumber: "ORD001",
          createdAt: new Date(),
          orderStatus: "delivered",
          items: [
            { 
              product: { 
                name: "Robot Mèo Puffy", 
                price: 129.99, 
                image: "/images/products/robot/robot-meo-puffy.webp" 
              }, 
              quantity: 1 
            }
          ],
          totalAmount: 129.99,
          shippingAddress: {
            fullName: "Nguyễn Văn Demo",
            phone: "0987654321"
          }
        }
      ];
      
      return res.render("orders", {
        active: "orders",
        title: "Đơn hàng của tôi - DATN Shop",
        orders: demoOrders
      });
    }
    
    // Production: lấy từ database qua API hoặc controller
    const Order = require('./models/Order');
    const orders = await Order.find({ user: req.session.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean();
    
    res.render("orders", {
      active: "orders",
      title: "Đơn hàng của tôi - DATN Shop",
      orders: orders
    });
    
  } catch (error) {
    console.error("Error loading orders:", error);
    res.render("orders", {
      active: "orders",
      title: "Đơn hàng của tôi - DATN Shop",
      orders: [],
      error: "Không thể tải danh sách đơn hàng"
    });
  }
});

// Order detail page
app.get("/my-orders/:id", async (req, res) => {
  if (!req.session.user) {
    return res.redirect(`/login?redirect=/my-orders/${req.params.id}`);
  }
  
  try {
    // Trong demo mode
    if (database.isDemo()) {
      const demoOrder = {
        _id: req.params.id,
        orderNumber: "ORD" + req.params.id.slice(-3).toUpperCase(),
        createdAt: new Date(),
        orderStatus: "processing",
        paymentMethod: "cod",
        paymentStatus: "pending",
        shippingAddress: {
          fullName: "Nguyễn Văn Demo",
          phone: "0987654321",
          address: "123 Đường ABC",
          city: "Hà Nội",
          district: "Cầu Giấy",
          ward: "Dịch Vọng"
        },
        items: [
          { 
            product: { 
              name: "Robot Mèo Puffy", 
              price: 129.99, 
              image: "/images/products/robot/robot-meo-puffy.webp" 
            }, 
            quantity: 1,
            color: "Hồng",
            size: "M"
          }
        ],
        totalAmount: 129.99,
        shippingFee: 0,
        note: "Giao hàng giờ hành chính"
      };
      
      return res.render("order-detail", {
        active: "orders",
        title: `Đơn hàng #${demoOrder.orderNumber} - DATN Shop`,
        order: demoOrder
      });
    }
    
    // Production: lấy từ database
    const Order = require('./models/Order');
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.session.user._id 
    })
    .populate('items.product')
    .lean();
    
    if (!order) {
      return res.status(404).render("404", {
        title: "Không tìm thấy đơn hàng",
        message: "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập"
      });
    }
    
    res.render("order-detail", {
      active: "orders",
      title: `Đơn hàng #${order.orderNumber} - DATN Shop`,
      order: order
    });
    
  } catch (error) {
    console.error("Error loading order detail:", error);
    res.status(500).render("error", {
      title: "Lỗi",
      message: "Không thể tải thông tin đơn hàng"
    });
  }
});

// Profile page
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login?redirect=/profile");
  }
  
  res.render("profile", {
    active: "profile",
    title: "Tài khoản - DATN Shop",
    user: req.session.user
  });
});

// Order confirmation page
app.get("/order-confirmation/:id", (req, res) => {
  res.render("order-confirmation", {
    active: "orders",
    title: "Xác nhận đơn hàng - DATN Shop",
    orderId: req.params.id,
    user: req.session.user || null
  });
});

// Payment page (redirect to checkout)
app.get("/payment", (req, res) => {
  res.redirect("/checkout");
});

/* ======================= HEALTH & STATUS ENDPOINTS ======================= */
app.get("/health", (req, res) => {
  const dbStatus = database.checkConnection() ? "connected" : "disconnected";
  const dbMode = database.isDemo() ? "demo" : "production";
  
  res.json({
    status: "OK",
    application: "DATN E-Commerce",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
    },
    database: {
      status: dbStatus,
      mode: dbMode,
      readyState: mongoose.connection.readyState,
      demoMode: database.isDemo()
    },
    session: {
      active: !!req.session.user,
      userId: req.session.user?._id || null
    }
  });
});

app.get("/status", (req, res) => {
  res.render("status", {
    active: "status",
    title: "Trạng thái hệ thống - DATN Shop",
    demoMode: database.isDemo(),
    dbStatus: database.checkConnection() ? "Connected" : "Disconnected",
    dbMode: database.isDemo() ? "Demo Mode" : "Production",
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// API Documentation
app.get("/api-docs", (req, res) => {
  res.render("api-docs", {
    active: "docs",
    title: "API Documentation - DATN Shop"
  });
});

/* ======================= ERROR HANDLING ======================= */
// 404 - Page not found
app.use((req, res, next) => {
  res.status(404).render("404", {
    title: "Không tìm thấy trang",
    active: "",
    url: req.originalUrl,
    message: "Trang bạn tìm kiếm không tồn tại."
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Application Error:");
  console.error(err.stack);
  
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    // API error
    res.status(statusCode).json({
      success: false,
      message: isProduction ? "Internal Server Error" : err.message,
      ...(!isProduction && { stack: err.stack })
    });
  } else {
    // Page error
    res.status(statusCode).render("error", {
      title: "Đã xảy ra lỗi",
      message: isProduction ? "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau." : err.message,
      statusCode: statusCode,
      stack: isProduction ? null : err.stack,
      demoMode: database.isDemo()
    });
  }
});

/* ======================= SERVER STARTUP ======================= */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "localhost";
  
  const server = app.listen(PORT, HOST, () => {
    console.log("\n" + "=".repeat(60));
    console.log("✅ DATN E-COMMERCE STARTED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`🚀 Server URL: http://${HOST}:${PORT}`);
    console.log(`📅 Started: ${new Date().toLocaleString()}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database Mode: ${database.isDemo() ? 'DEMO' : 'PRODUCTION'}`);
    console.log("=".repeat(60) + "\n");
    
    console.log("📖 AVAILABLE PAGES:");
    console.log("  /                     → Splash page");
    console.log("  /login                → Login page");
    console.log("  /register             → Register page");
    console.log("  /shop                 → Shop page");
    console.log("  /cart                 → Cart page");
    console.log("  /checkout             → Checkout page");
    console.log("  /my-orders            → My Orders page");
    console.log("  /my-orders/:id        → Order Detail page");
    console.log("  /profile              → Profile page");
    console.log("  /order-confirmation/:id → Order Confirmation");
    console.log("  /health               → Health check (JSON)");
    console.log("  /status               → Status page");
    console.log("  /api-docs             → API Documentation\n");
    
    console.log("🔌 AVAILABLE APIs:");
    console.log("  POST /api/orders      → Create order");
    console.log("  GET  /api/orders      → Get user orders");
    console.log("  GET  /api/orders/:id  → Get order detail");
    console.log("  PUT  /api/orders/:id/cancel → Cancel order");
    console.log("  GET  /api/auth/check  → Check authentication");
    console.log("  POST /api/auth/login  → Login");
    console.log("  POST /api/auth/logout → Logout\n");
    
    console.log("💡 TIPS:");
    console.log("  • Set DEMO_MODE=false in .env to use real database");
    console.log("  • Check /status for system information");
    console.log("  • MongoDB should run on localhost:27017");
    console.log("=".repeat(60) + "\n");
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      database.disconnect();
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down...');
    server.close(() => {
      console.log('Server closed.');
      database.disconnect();
      process.exit(0);
    });
  });
}

module.exports = app; 