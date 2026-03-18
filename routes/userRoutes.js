const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// =======================
// DANH SÁCH USER
// =======================
router.get("/", userController.getUsers);

// =======================
// THÊM USER
// =======================
router.get("/add", userController.getAddUser);
router.post("/add", userController.createUser);

// =======================
// SỬA USER
// =======================
router.get("/edit/:id", userController.getEditUser);
router.post("/edit/:id", userController.updateUser);

// =======================
// TOGGLE STATUS
// =======================
router.get("/toggle/:id", userController.toggleUser);

// =======================
// XÓA USER
// =======================
router.get("/delete/:id", userController.deleteUser);

// =======================
// CHI TIẾT USER (phải để cuối)
// =======================
router.get("/:id", userController.getUserDetail);

module.exports = router;