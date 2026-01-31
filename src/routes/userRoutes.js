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

module.exports = router;
