const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email });

  if (!admin) {
    return res.send("Không tồn tại admin");
  }

  if (admin.password !== password) {
    return res.send("Sai mật khẩu");
  }

  req.session.user = admin;   // lưu session

  res.redirect("/admin");

});

router.get("/logout", (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      return res.send("Lỗi khi đăng xuất");
    }

    res.redirect("/login");
  });

});
module.exports = router;