const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Danh sách danh mục
router.get("/admin/categories", categoryController.getCategories);

// Form thêm
router.get("/admin/categories/add", categoryController.getAddCategory);
router.post("/admin/categories/add", categoryController.createCategory);

// Form sửa
router.get("/admin/categories/edit/:id", categoryController.getEditCategory);
router.post("/admin/categories/edit/:id", categoryController.updateCategory);

// Xóa
router.get("/admin/categories/delete/:id", categoryController.deleteCategory);

module.exports = router;