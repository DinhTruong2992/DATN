const Category = require("../models/Category");

// Danh sách
exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.render("admin/category/categories", { categories });
};

// Form thêm
exports.getAddCategory = (req, res) => {
  res.render("admin/category/add");
};

// Thêm
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.redirect("/admin/categories");
};

// Form sửa
exports.getEditCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("admin/category/edit", { category });
};

// Cập nhật
exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  await Category.findByIdAndUpdate(req.params.id, { name });
  res.redirect("/admin/categories");
};

// Xóa
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/admin/categories");
};