const Category = require("../models/Category");

// =======================
// Danh sách danh mục
// =======================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.render("admin/category/categories", {
      categories,
      success: req.query.success
    });

  } catch (err) {
    console.log(err);
    res.send("Lỗi tải danh mục");
  }
};

// =======================
// Form thêm
// =======================
exports.getAddCategory = (req, res) => {
  res.render("admin/category/add", {
    success: req.query.success,
    errors: {},
    old: {}
  });
};

// =======================
// Thêm (có validate)
// =======================
exports.createCategory = async (req, res) => {
  try {
    let { name, description } = req.body;

    name = name?.trim();

    let errors = {};

    // VALIDATE
    if (!name) {
      errors.name = "Không được để trống";
    }

    // Nếu lỗi → render lại form
    if (Object.keys(errors).length > 0) {
      return res.render("admin/category/add", {
        errors,
        old: req.body,
        success: null
      });
    }

    // CREATE
    await Category.create({
      name,
      description,
      status: 1
    });

    // 👉 redirect có success
    res.redirect("/admin/categories/add?success=1");

  } catch (err) {
    console.log(err);
    res.send("Lỗi thêm danh mục");
  }
};

// =======================
// Form sửa
// =======================
exports.getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.send("Không tìm thấy danh mục");

    res.render("admin/category/edit", {
      category,
      success: req.query.success,
      errors: {}
    });

  } catch (err) {
    console.log(err);
    res.send("Không tìm thấy danh mục");
  }
};

// =======================
// Cập nhật (có validate)
// =======================
exports.updateCategory = async (req, res) => {
  try {
    let { name, description } = req.body;

    name = name?.trim();

    let errors = {};

    if (!name) {
      errors.name = "Không được để trống";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("admin/category/edit", {
        category: { ...req.body, _id: req.params.id },
        errors,
        success: null
      });
    }

    await Category.findByIdAndUpdate(req.params.id, {
      name,
      description
    });

    // 👉 redirect có success
    res.redirect(`/admin/categories/edit/${req.params.id}?success=1`);

  } catch (err) {
    console.log(err);
    res.send("Lỗi cập nhật");
  }
};

// =======================
// Xóa
// =======================
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.redirect("/admin/categories?success=deleted");

  } catch (err) {
    console.log(err);
    res.send("Lỗi xóa");
  }
};

// =======================
// Toggle Status
// =======================
exports.toggleStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.send("Không tồn tại");

    category.status = category.status === 1 ? 0 : 1;

    await category.save();

    res.redirect("/admin/categories");

  } catch (err) {
    console.log(err);
    res.send("Lỗi đổi trạng thái");
  }
};