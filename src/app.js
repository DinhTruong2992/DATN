const express = require("express");
const session = require("express-session");
const config = require("./config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");



const app = express();

/* ======================= DATABASE ======================= */
const { connectDB } = require("./config/database");
connectDB();

/* ======================= MIDDLEWARE ======================= */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION MIDDLEWARE (QUAN TRỌNG)
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

/* ======================= VIEW ENGINE ======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/* ======================= API ROUTES ======================= */
app.use("/api/auth", authRoutes);

/* ======================= PAGE ROUTES ======================= */
app.use("/", shopRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);


// Splash
app.get("/", (req, res) => {
  res.redirect("/splash");
});

app.get("/splash", (req, res) => {
  res.render("splash");
});

// Auth pages
app.get("/login", (req, res) => {
  const message = req.query.registered
    ? { type: "success", text: "Registration successful! Please login." }
    : req.query.error
      ? { type: "danger", text: decodeURIComponent(req.query.error) }
      : null;
  res.render("login", { message });
});

app.get("/register", (req, res) => {
  const message = req.query.error
    ? { type: "danger", text: decodeURIComponent(req.query.error) }
    : null;
  res.render("register", { message });
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

app.get("/shop", (req, res) => {
  res.render("shop", { active: "shop" });
});



app.get("/cart", (req, res) => {
  res.render("cart", { active: "cart" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { active: "profile" });
});

app.get("/payment", (req, res) => {
  res.render("payment", {
    user: { name: "", phone: "" },
    cart: { items: [], totalPrice: 0 }
  });
});

/* ======================= HEALTH CHECK ======================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

/* ======================= ERROR HANDLING ======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;

