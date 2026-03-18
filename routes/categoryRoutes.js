const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", categoryController.getCategories);

router.get("/add", categoryController.getAddCategory);

router.post("/add", categoryController.createCategory);

router.get("/edit/:id", categoryController.getEditCategory);

router.post("/edit/:id", categoryController.updateCategory);

router.get("/delete/:id", categoryController.deleteCategory);

router.get("/toggle-status/:id", categoryController.toggleStatus);

module.exports = router;