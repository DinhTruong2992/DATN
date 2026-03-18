const User = require("../models/user");

// ===============================
// DANH SÁCH USER
// ===============================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.render("admin/users/users", { users });
  } catch (err) {
    console.log(err);
    res.send("Lỗi load user");
  }
};

// ===============================
// CHI TIẾT USER (FIX LỖI CHÍNH)
// ===============================
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");

    if (!user) return res.send("User không tồn tại");

    res.render("admin/users/user-detail", { user });

  } catch (err) {
    console.log(err);
    res.send("Không tìm thấy user");
  }
};

// ===============================
// FORM THÊM USER
// ===============================
exports.getAddUser = (req, res) => {
  res.render("admin/users/add", {
    success: req.query.success,
    errors: {},
    old: {}
  });
};

// ===============================
// TẠO USER (VALIDATE)
// ===============================
exports.createUser = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();

    let errors = {};

    if (!username) errors.username = "Không được để trống";

    if (!email) errors.email = "Không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Email không hợp lệ";

    if (!password || password.length < 6)
      errors.password = "Password ≥ 6 ký tự";

    const exist = await User.findOne({ email });
    if (exist) errors.email = "Email đã tồn tại";

    if (Object.keys(errors).length > 0) {
      return res.render("admin/users/add", {
        errors,
        old: req.body,
        success: null
      });
    }

    await User.create({
      username,
      email,
      password,
      role,
      status: 1
    });

    res.redirect("/admin/users/add?success=1");

  } catch (err) {
    console.log(err);
    res.send("Lỗi tạo user");
  }
};

// ===============================
// FORM SỬA USER
// ===============================
exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.send("User không tồn tại");

    res.render("admin/users/edit", {
      user,
      success: req.query.success,
      errors: {}
    });
  } catch (err) {
    console.log(err);
    res.send("Lỗi load user");
  }
};

// ===============================
// UPDATE USER (VALIDATE)
// ===============================
exports.updateUser = async (req, res) => {
  try {
    let { username, email, role, status } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();

    let errors = {};

    if (!username) errors.username = "Không được để trống";

    if (!email) errors.email = "Không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Email không hợp lệ";

    const exist = await User.findOne({
      email,
      _id: { $ne: req.params.id }
    });

    if (exist) errors.email = "Email đã tồn tại";

    if (Object.keys(errors).length > 0) {
      return res.render("admin/users/edit", {
        user: { ...req.body, _id: req.params.id },
        errors,
        success: null
      });
    }

    await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      role,
      status
    });

    res.redirect(`/admin/users/edit/${req.params.id}?success=1`);

  } catch (err) {
    console.log(err);
    res.send("Lỗi cập nhật user");
  }
};

// ===============================
// XÓA USER
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    console.log(err);
    res.send("Lỗi xóa user");
  }
};

// ===============================
// TOGGLE STATUS
// ===============================
exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.send("User không tồn tại");

    user.status = user.status === 1 ? 0 : 1;

    await user.save();

    res.redirect("/admin/users");
  } catch (err) {
    console.log(err);
    res.send("Lỗi toggle");
  }
};