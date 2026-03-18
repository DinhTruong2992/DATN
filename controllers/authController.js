exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login", { error: "Email không tồn tại" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render("login", { error: "Sai mật khẩu" });
  }

  req.session.user = user;
  res.redirect("/admin");
};