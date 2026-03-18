const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

// ============================
// Danh sách sản phẩm
// ============================
router.get("/", productController.getProducts);


// ============================
// Form thêm sản phẩm
// ============================
router.get("/add", productController.getAddProduct);


// ============================
// Thêm sản phẩm
// ============================
router.post(
  "/add",
  upload.single("image"),
  productController.createProduct
);


// ============================
// Form sửa sản phẩm
// ============================
router.get("/edit/:id", productController.getEditProduct);


// ============================
// Cập nhật sản phẩm
// ============================
router.post(
  "/edit/:id",
  upload.single("image"),
  productController.updateProduct
);


// ============================
// Xóa sản phẩm
// ============================
router.get("/delete/:id", productController.deleteProduct);


// ============================
// Đổi trạng thái sản phẩm
// ============================
router.get("/status/:id", productController.changeStatus);


module.exports = router;