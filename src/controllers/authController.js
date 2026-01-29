const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    const existed = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: 'Username hoặc email đã tồn tại'
      });
    }

    const user = new User({
      username,
      email,
      password,      // model tự hash
      phoneNumber
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công'
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // 🔐 Tạo JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      redirectTo: '/shop'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};

module.exports = {
  register: registerUser,
  login: loginUser
};

