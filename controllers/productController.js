const Product = require("../models/Product");
const Category = require("../models/Category");

// Hiển thị danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    // populate category để hiển thị tên danh mục
    const products = await Product.find().populate("category");
    res.render("admin/products", { products });
  } catch (error) {
    console.log(error);
    res.send("Lỗi load sản phẩm");
  }
};

// Form thêm sản phẩm
exports.getAddProduct = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/add-product", { categories });
  } catch (error) {
    console.log(error);
    res.send("Lỗi load form thêm sản phẩm");
  }
};

// Thêm sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;

    if (!name || !price || !category) return res.send("Thiếu thông tin bắt buộc");

    const product = new Product({
      name,
      price,
      category,   // là ObjectId của category
      stock,
      description,
      image: req.file ? req.file.filename : null
    });

    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    res.send("Lỗi thêm sản phẩm");
  }
};

// Form sửa sản phẩm
exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    res.render("admin/edit-product", { product, categories });
  } catch (error) {
    console.log(error);
    res.send("Lỗi load form sửa sản phẩm");
  }
};

// Update sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;
    const updateData = {
      name,
      price,
      category,
      stock,
      description
    };

    if (req.file) updateData.image = req.file.filename;

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    res.send("Lỗi update sản phẩm");
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    res.send("Lỗi xóa sản phẩm");
  }
};