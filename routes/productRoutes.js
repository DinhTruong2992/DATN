const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

// Danh sách sản phẩm
router.get("/", productController.getProducts);

// Form thêm sản phẩm
router.get("/add", productController.getAddProduct);

// Thêm sản phẩm (có upload ảnh)
router.post("/add", upload.single("image"), productController.createProduct);

// Form sửa sản phẩm
router.get("/edit/:id", productController.getEditProduct);

// Cập nhật sản phẩm (có upload ảnh)
router.post("/edit/:id", upload.single("image"), productController.updateProduct);

// Xóa sản phẩm
router.get("/delete/:id", productController.deleteProduct);

module.exports = router;