require("dotenv").config();
const adminRouter = require("./routes/adminRoutes");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { isAuthenticated } = require("./middleware/auth");

const app = express();

// MongoDB
console.log("🌐 Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));



app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use("/", authRoutes);
app.use("/", categoryRoutes);

app.use("/admin/products", isAuthenticated, require("./routes/productRoutes"));
app.use("/admin", isAuthenticated, require("./routes/dashboardRoutes"));

app.use("/", adminRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}/admin`);
});