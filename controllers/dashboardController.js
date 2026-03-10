const Product = require("../models/Product");

exports.getDashboard = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  res.render("dashboard", { count: totalProducts });
};
