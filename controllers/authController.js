const User = require("../models/user");
const bcrypt = require("bcrypt");

// Hiển thị form đăng ký
exports.getRegister = (req, res) => {
  res.render("register");
};

// Xử lý đăng ký
exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    role: "admin"
  });

  res.redirect("/login");
};

// Hiển thị form login
exports.getLogin = (req, res) => {
  res.render("login");
};

// Xử lý login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Sai mật khẩu");

  req.session.user = user;
  res.redirect("/admin");
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};