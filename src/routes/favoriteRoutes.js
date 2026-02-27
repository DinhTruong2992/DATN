const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Favorite = require("../models/Favorite");

// Xem trang yêu thích
router.get("/", async (req, res) => {
 if (!req.session?.user) {
  return res.status(401).render("need-login", {
    message: "Vui lòng đăng nhập để sử dụng giỏ hàng"
  });
}

  const favorites = await Favorite.find({
    user: req.session.user._id,
  })
    .populate("product")
    .lean();

  res.render("favorite", {
    products: favorites.map((f) => f.product),
  });
});

// Toggle favorite
router.post("/toggle/:id", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ success: false });
    }

    const userId = req.session.user._id;
    const productId = req.params.id;

    const existing = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
    } else {
      await Favorite.create({
        user: userId,
        product: productId,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
// Lấy danh sách favorite dưới dạng JSON
router.get("/list", async (req, res) => {
  if (!req.session?.user) {
    return res.json({ favorites: [] });
  }

  const favs = await Favorite.find({
    user: req.session.user._id,
  });

  res.json({
    favorites: favs.map((f) => f.product.toString()),
  });
});

module.exports = router;
