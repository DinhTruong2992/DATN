const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
// SHOP
router.get("/shop", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const products = await Product.find().populate("id_category").lean();
    const productsByCategory = categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      products: products.filter(
        (p) =>
          p.id_category && p.id_category._id.toString() === cat._id.toString(),
      ),
    }));
    res.render("shop", { productsByCategory });
  } catch (err) {
    console.error(err);
    res.status(500).send("Load shop failed");
  }
}); // PRODUCT DETAIL
router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("id_category")
    .lean();
  if (!product) return res.redirect("/shop");
  res.render("product-detail", { product });
});
module.exports = router;
