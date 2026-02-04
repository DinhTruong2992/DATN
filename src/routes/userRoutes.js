const express = require("express");
const router = express.Router();
const User = require("../models/User");

// PROFILE PAGE
router.get("/profile", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.user._id).lean();

    res.render("profile", {
      user
    });

  } catch (err) {
    console.error(err);
    res.send("Load profile failed");
  }
});

// // VIEW PROFILE
// router.get("/profile", async (req, res) => {
//   if (!req.session?.user) {
//     return res.redirect("/login");
//   }

//   const user = await User.findById(req.session.user._id).lean();

//   res.render("profile-view", {
//     user
//   });
// });

// Middleware check login
const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  next();
};

// ===== PROFILE MENU =====
router.get("/profile", requireLogin, (req, res) => {
  res.render("profile", {
    user: req.session.user,
    active: "profile"
  });
});

// ===== VIEW PROFILE INFO =====
router.get("/profile/info", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();

  res.render("profile-info", {
    user,
    active: "profile"
  });
});

// Trang chỉnh sửa 
router.get("/profile/edit", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.user._id).lean();
  res.render("profile-edit", { user });
});
// ================= UPDATE PROFILE =================
router.post("/profile/edit", requireLogin, async (req, res) => {
  const { username, phoneNumber } = req.body;

  await User.findByIdAndUpdate(req.session.user._id, {
    username,
    phoneNumber
  });

  // cập nhật lại session
  req.session.user.username = username;

  res.redirect("/profile");
});
module.exports = router;
