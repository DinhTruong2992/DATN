const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Favorite = require("../models/Favorite");


// SHOP
router.get("/shop", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;

    let filter = {};

    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        filter.id_category = cat._id;
      }
    }

    if (minPrice && maxPrice) {
      filter.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let query = Product.find(filter);

    if (sort === "price_asc") {
      query = query.sort({ price: 1 });
    } else if (sort === "price_desc") {
      query = query.sort({ price: -1 });
    }

    const products = await query.lean();
    const categories = await Category.find().lean();

    // 🔥 FAVORITES
    let favorites = [];

    if (req.session?.user) {
      const favs = await Favorite.find({
        user: req.session.user._id,
      });

      favorites = favs.map((f) => f.product.toString());
    }

    res.render("shop", {
      products,
      categories,
      favorites,
      query: req.query,
    });
  } catch (err) {
    console.error(err);
    res.send("Load shop failed");
  }
});

// PRODUCT DETAIL
router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  const relatedProducts = await Product.find({
    id_category: product.id_category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .lean();

  let favorites = [];

  if (req.session?.user) {
    const favs = await Favorite.find({
      user: req.session.user._id,
    });

    favorites = favs.map(f => f.product.toString());
  }

  res.render("product-detail", {
    product,
    relatedProducts,
    favorites
  });
});


// FAVORITE PAGE
router.get("/favorites", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }

  const favorites = await Favorite.find({
    user: req.session.user._id
  }).populate("product").lean();

  res.render("favorite", {
    products: favorites.map(f => f.product)
  });
});


module.exports = router;
