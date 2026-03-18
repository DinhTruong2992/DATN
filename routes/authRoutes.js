const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// Hiển thị trang login
router.get("/login", (req, res) => {
  res.render("login", {
    error: null,
    email: "",
    password: "",
    showPassword: false
  });
});

// Xử lý login
router.post("/login", async (req, res) => {

  const { email, password, showPassword } = req.body;

  try {

    const admin = await Admin.findOne({ email });

    // Email không tồn tại
    if (!admin) {
      return res.render("login", {
        error: "Email không tồn tại",
        email,
        password,
        showPassword: showPassword === "true"
      });
    }

    // Sai mật khẩu
    if (admin.password !== password) {
      return res.render("login", {
        error: "Sai mật khẩu",
        email,
        password,
        showPassword: showPassword === "true"
      });
    }

    // Login thành công
    req.session.user = admin;

    res.redirect("/admin");

  } catch (err) {
    console.error(err);
    res.render("login", {
      error: "Lỗi server",
      email,
      password,
      showPassword: showPassword === "true"
    });
  }

});

// Logout
router.get("/logout", (req, res) => {

  req.session.destroy(err => {

    if (err) {
      return res.send("Lỗi khi đăng xuất");
    }

    res.redirect("/login");

  });

});

module.exports = router;