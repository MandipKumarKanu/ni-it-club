const User = require("../models/User");
const { logActivity } = require("./logController");
const bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, designation, role, permissions } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      designation,
      role,
      permissions,
      isFirstLogin: true,
    });

    if (user) {
      await logActivity(
        req.user._id,
        "CREATE",
        "USER",
        `Created user: ${user.email}`,
        req
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.designation = req.body.designation || user.designation;
      user.role = req.body.role || user.role;
      user.permissions = req.body.permissions || user.permissions;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      await logActivity(
        req.user._id,
        "UPDATE",
        "USER",
        `Updated user: ${updatedUser.email}`,
        req
      );

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        designation: updatedUser.designation,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: user._id });

      await logActivity(
        req.user._id,
        "DELETE",
        "USER",
        `Deleted user: ${user.email}`,
        req
      );

      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      user.isFirstLogin = false;
      await user.save();

      await logActivity(
        req.user._id,
        "UPDATE",
        "USER",
        "Changed password",
        req
      );

      res.json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
