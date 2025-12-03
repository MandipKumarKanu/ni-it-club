const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");
const { getResetPasswordOTPTemplate } = require("../utils/emailTemplates");
const crypto = require("crypto");
const { getClientIP } = require("../utils/ipUtils");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isFirstLogin: user.isFirstLogin,
      accessToken,
    });

    // Log Login Activity
    try {
      await ActivityLog.create({
        user: user._id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        action: "LOGIN",
        module: "Auth",
        details: "User logged in successfully",
        ipAddress: getClientIP(req),
        method: req.method,
        url: req.originalUrl,
      });
    } catch (error) {
      console.error("Login Logging Error:", error.message);
    }
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  const cookie = req.cookies.jwt;
  if (!cookie) return res.sendStatus(204);

  const user = await User.findOne({ refreshToken: cookie });
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  await user.save();

  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });

  if (!user) return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id)
      return res.status(403).json({ message: "Forbidden" });

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/me
// @access  Private
const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset OTP - NI-IT Club",
        html: getResetPasswordOTPTemplate(otp, user.name),
      });

      console.log("Email sent successfully");
      res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error("Email send error:", error);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined;
      await user.save();

      return res
        .status(500)
        .json({ message: "Email could not be sent", error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const resetPasswordOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOtp,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    user.isFirstLogin = false;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateCurrentUser,
  forgotPassword,
  resetPassword,
};
