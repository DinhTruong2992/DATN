const express = require("express");
const session = require("express-session");
const config = require("./config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Database - SỬA: Import database instance mới
const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

/* ======================= STARTUP LOG ======================= */
console.log("\n" + "=".repeat(50));
console.log("🚀 DATN Application Starting...");
console.log("=".repeat(50));
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📊 DEMO_MODE: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
console.log(`🎯 Port: ${process.env.PORT || 3000}`);
console.log("=".repeat(50) + "\n");

/* ======================= DATABASE CONNECTION ======================= */
// SỬA: Dùng database.connect() mới
async function initializeDatabase() {
  try {
    await database.connect();
    
    // Log database status
    if (database.isDemo()) {
      console.log("📱 RUNNING IN DEMO MODE");
      console.log("💾 Using in-memory mock data");
      console.log("ℹ️  To use real database, set DEMO_MODE=false in .env\n");
    } else {
      console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
      console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
      console.log(`🔗 Host: ${mongoose.connection.host || 'Unknown'}\n`);
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.log("🔄 Continuing in DEMO MODE\n");
  }
}

initializeDatabase();

/* ======================= MIDDLEWARE ======================= */
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5500",
  credentials: true
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ SESSION MIDDLEWARE với config động
app.use(session({
  secret: process.env.SESSION_SECRET || config.session.secret || "datn_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  },
  // Thêm store nếu cần (MemoryStore mặc định)
}));

// Middleware để thêm database info vào request
app.use((req, res, next) => {
  req.demoMode = database.isDemo();
  req.db = database.getConnection();
  next();
});

/* ======================= VIEW ENGINE ======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

/* ======================= GLOBAL VIEW VARIABLES ======================= */
app.use((req, res, next) => {
  // Thêm biến toàn cục cho tất cả views
  res.locals.demoMode = database.isDemo();
  res.locals.env = process.env.NODE_ENV;
  res.locals.active = ""; // Mặc định
  next();
});

/* ======================= API ROUTES ======================= */
app.use("/api/auth", authRoutes);

/* ======================= PAGE ROUTES ======================= */
app.use("/", shopRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);

/* ======================= CORE PAGES ======================= */
// Splash page
app.get("/", (req, res) => {
  res.redirect("/splash");
});

app.get("/splash", (req, res) => {
  res.render("splash", { 
    active: "home",
    demoMode: database.isDemo()
  });
});

// Auth pages
app.get("/login", (req, res) => {
  const message = req.query.registered
    ? { type: "success", text: "Registration successful! Please login." }
    : req.query.error
      ? { type: "danger", text: decodeURIComponent(req.query.error) }
      : null;
  res.render("login", { 
    message,
    active: "auth",
    demoMode: database.isDemo()
  });
});

app.get("/register", (req, res) => {
  const message = req.query.error
    ? { type: "danger", text: decodeURIComponent(req.query.error) }
    : null;
  res.render("register", { 
    message,
    active: "auth",
    demoMode: database.isDemo()
  });
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", { 
    active: "auth",
    demoMode: database.isDemo()
  });
});

// Shop page
app.get("/shop", (req, res) => {
  res.render("shop", { 
    active: "shop",
    demoMode: database.isDemo()
  });
});

// Cart page
app.get("/cart", (req, res) => {
  res.render("cart", { 
    active: "cart",
    demoMode: database.isDemo()
  });
});

// Profile page
app.get("/profile", (req, res) => {
  // Lấy user từ session (nếu có)
  const user = req.session.user || null;
  res.render("profile", { 
    active: "profile",
    user,
    demoMode: database.isDemo()
  });
});

// Payment page (THÊM MỚI)
app.get("/payment", (req, res) => {
  // Mock order data cho demo
  const order = {
    id: "ORDER_" + Date.now(),
    items: [
      { name: "Nike Air Max", price: 129.99, quantity: 1 },
      { name: "Nike Socks", price: 10.00, quantity: 2 }
    ],
    subtotal: 149.99,
    shipping: 0,
    tax: 0,
    total: 149.99,
    shippingAddress: {
      name: "John Smith",
      street: "2950 S 108th St",
      city: "West Allis",
      zip: "53227",
      country: "US",
      email: "john@mail.com"
    }
  };
  
  res.render("payment", { 
    active: "cart",
    order,
    demoMode: database.isDemo()
  });
});

// Order confirmation (THÊM MỚI)
app.get("/order-confirmation", (req, res) => {
  const orderId = req.query.order || "ORDER_" + Date.now();
  res.render("order-confirmation", { 
    active: "orders",
    orderId,
    demoMode: database.isDemo()
  });
});

/* ======================= HEALTH CHECK ======================= */
app.get("/health", (req, res) => {
  const dbStatus = database.checkConnection() ? "connected" : "disconnected";
  const dbMode = database.isDemo() ? "demo" : "production";
  
  res.json({
    status: "OK",
    application: "DATN E-Commerce",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    database: {
      status: dbStatus,
      mode: dbMode,
      readyState: mongoose.connection.readyState
    },
    demo_mode: database.isDemo(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Status page (THÊM MỚI)
app.get("/status", (req, res) => {
  res.render("status", {
    active: "status",
    demoMode: database.isDemo(),
    dbStatus: database.checkConnection() ? "Connected" : "Disconnected",
    dbMode: database.isDemo() ? "Demo Mode" : "Production",
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    uptime: process.uptime()
  });
});

/* ======================= ERROR HANDLING ======================= */
// 404 - Page not found
app.use((req, res, next) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    active: "",
    demoMode: database.isDemo()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  
  // Trong demo mode, hiển thị lỗi friendly
  if (database.isDemo()) {
    return res.status(500).render("error", {
      title: "Something went wrong",
      message: err.message || "An error occurred",
      demoMode: true,
      error: process.env.NODE_ENV === "development" ? err : {}
    });
  }
  
  // Production error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal Server Error" 
      : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

/* ======================= SERVER STARTUP ======================= */
// Chỉ start server nếu file được chạy trực tiếp
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "localhost";
  
  app.listen(PORT, HOST, () => {
    console.log("\n" + "=".repeat(50));
    console.log("✅ DATN Application Started Successfully!");
    console.log("=".repeat(50));
    console.log(`🚀 Server: http://${HOST}:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: ${database.isDemo() ? 'DEMO MODE' : 'PRODUCTION'}`);
    console.log(`📈 Status: http://${HOST}:${PORT}/health`);
    console.log(`📚 API: http://${HOST}:${PORT}/api`);
    console.log("=".repeat(50) + "\n");
    
    // Log routes available
    console.log("📖 Available Routes:");
    console.log("  /                     → Splash page");
    console.log("  /login                → Login page");
    console.log("  /register             → Register page");
    console.log("  /shop                 → Shop page");
    console.log("  /cart                 → Cart page");
    console.log("  /profile              → Profile page");
    console.log("  /payment              → Payment page");
    console.log("  /health               → Health check (JSON)");
    console.log("  /status               → Status page (HTML)\n");
  });
}

module.exports = app;