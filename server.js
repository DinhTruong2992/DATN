require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");

const { isAuthenticated } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// =======================
// MongoDB
// =======================
console.log("🌐 Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// =======================
// View engine
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =======================
// Middleware
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

// =======================
// Routes
// =======================
app.use("/", authRoutes);
app.use("/", categoryRoutes);

app.use("/admin/products", isAuthenticated, productRoutes);
app.use("/admin", isAuthenticated, dashboardRoutes);

// **Mount user routes**
app.use("/admin/users", isAuthenticated, userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}/admin`);
});