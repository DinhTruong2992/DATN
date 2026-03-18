const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/user");

router.get("/", async (req, res) => {

  try {

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();

    res.render("admin", {
      totalProducts,
      totalCategories,
      totalUsers
    });

  } catch (err) {

    console.log(err);
    res.send("Dashboard error");

  }

});

module.exports = router;