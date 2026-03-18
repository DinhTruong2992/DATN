const Product = require("../models/Product");
const Category = require("../models/Category");


// ===============================
// Danh sách sản phẩm
// ===============================
exports.getProducts = async (req, res) => {

  try {

    const products = await Product.find()
      .populate("id_category");

    res.render("admin/products", { products });

  } catch (err) {

    console.log(err);
    res.send("Lỗi tải sản phẩm");

  }

};


// ===============================
// Form thêm sản phẩm
// ===============================
exports.getAddProduct = async (req, res) => {

  try {

    const categories = await Category.find();

    res.render("admin/add-product", { categories });

  } catch (err) {

    console.log(err);
    res.send("Lỗi tải form thêm sản phẩm");

  }

};


// ===============================
// Thêm sản phẩm
// ===============================
exports.createProduct = async (req, res) => {

  try {

    const {
      name,
      price,
      id_category,
      description,
      stock,
      specifications,
      status
    } = req.body;

    const image = req.file ? req.file.filename : "";

    await Product.create({
      name,
      price,
      id_category,
      description,
      stock,
      status: status || 1,
      image,
      specifications: specifications ? JSON.parse(specifications) : {}
    });

    res.redirect("/admin/products");

  } catch (err) {

    console.log(err);
    res.send("Lỗi thêm sản phẩm");

  }

};


// ===============================
// Form sửa sản phẩm
// ===============================
exports.getEditProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    const categories = await Category.find();

    res.render("admin/edit-product", {
      product,
      categories
    });

  } catch (err) {

    console.log(err);
    res.send("Không tìm thấy sản phẩm");

  }

};


// ===============================
// Cập nhật sản phẩm
// ===============================
exports.updateProduct = async (req, res) => {

  try {

    const {
      name,
      price,
      id_category,
      description,
      stock,
      specifications,
      status
    } = req.body;

    const product = await Product.findById(req.params.id);

    product.name = name;
    product.price = price;
    product.id_category = id_category;
    product.description = description;
    product.stock = stock;
    product.status = status;

    product.specifications = specifications
      ? JSON.parse(specifications)
      : {};

    if (req.file) {
      product.image = req.file.filename;
    }

    await product.save();

    res.redirect("/admin/products");

  } catch (err) {

    console.log(err);
    res.send("Lỗi cập nhật sản phẩm");

  }

};


// ===============================
// Xóa sản phẩm
// ===============================
exports.deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.redirect("/admin/products");

  } catch (err) {

    console.log(err);
    res.send("Lỗi xóa sản phẩm");

  }

};


// ===============================
// Đổi trạng thái sản phẩm
// ===============================
exports.changeStatus = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.send("Không tìm thấy sản phẩm");
    }

    product.status = product.status == 1 ? 0 : 1;

    await product.save();

    res.redirect("/admin/products");

  } catch (err) {

    console.log(err);
    res.send("Lỗi đổi trạng thái");

  }

};