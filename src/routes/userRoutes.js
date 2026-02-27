const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware check login
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).render("need-login", {
      message: "Vui lòng đăng nhập để truy cập trang này"
    });
  }
  next();
};

// ===== PROFILE PAGE =====
router.get("/profile", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();

  res.render("profile", {
    user,
    active: "profile"
  });
});

// ===== PROFILE INFO =====
router.get("/profile/info", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();

  res.render("profile-info", {
    user,
    active: "profile"
  });
});

// ===== EDIT PROFILE =====
router.get("/profile/edit", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();
  res.render("profile-edit", { user });
});

// ===== UPDATE PROFILE =====
router.post("/profile/edit", requireLogin, async (req, res) => {
  const { username, phoneNumber } = req.body;

  await User.findByIdAndUpdate(req.session.user._id, {
    username,
    phoneNumber,
  });

  req.session.user.username = username;

  res.redirect("/profile");
});

module.exports = router;