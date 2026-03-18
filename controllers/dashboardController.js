const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/user");

exports.getDashboard = async (req, res) => {

const totalProducts = await Product.countDocuments();
const totalCategories = await Category.countDocuments();
const totalUsers = await User.countDocuments();

res.render("admin/dashboard",{
    totalProducts,
    totalCategories,
    totalUsers
});

};