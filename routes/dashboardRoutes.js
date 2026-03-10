const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/user");

router.get("/dashboard", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();

    res.render("dashboard", {
      productCount,
      categoryCount,
      userCount
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;