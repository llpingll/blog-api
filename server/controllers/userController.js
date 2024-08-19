const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.createUser = [
  // Sanitize input data
  body(
    "name",
    "Name must not be empty and must not have more than 30 characters."
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .toLowerCase()
    .escape(),
  body("email", "Email must be a valid email address.")
    .trim()
    .isEmail()
    .toLowerCase()
    .escape(),
  body(
    "password",
    "Password must not be empty and must not have more than 30 characters."
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("type", "Type must not be empty and must be either admin or user.")
    .trim()
    .notEmpty()
    .escape()
    .isIn(["admin", "user"]),

  // Process sanitized data
  asyncHandler(async (req, res) => {
    // Get validation result object
    const errors = validationResult(req);

    // Case, validation error
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: req.body.email }).exec();
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    // Create user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
    });

    // Hash password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, return error response
      if (err) {
        res.status(500).json({ error: "Password hash error" });
        return;
      }
      // otherwise, store hashedPassword in DB
      try {
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Signup Successful" });
      } catch (error) {
        console.error("Failed to save user:", error);
        res.status(500).json({ error: "Failed to save user" });
      }
    });
  }),
];

exports.getAllUsers = asyncHandler(async (req, res) => {
  // Query database for all users
  const users = User.find({}).exec();

  if (!users) {
    res.status(200).json({ error: "No users found" });
  } else {
    res.status(200).json({ users });
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id).exec();

  if (!user) {
    res.status(200).json({ error: "No user found" });
  } else {
    res.status(200).json({ user });
  }
});

exports.updateUser = [
  // Sanitize input data
  body(
    "name",
    "Name must not be empty and must not have more than 30 characters."
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .toLowerCase()
    .escape(),
  body("email", "Email must be a valid email address.")
    .trim()
    .isEmail()
    .toLowerCase()
    .escape(),
  body(
    "password",
    "Password must not be empty and must not have more than 30 characters."
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("type", "Type must not be empty and must be either admin or user.")
    .trim()
    .notEmpty()
    .escape()
    .isIn(["admin", "user"]),

  // Process sanitized data
  asyncHandler(async (req, res) => {
    // Get validation result object
    const errors = validationResult(req);

    // Create user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
      _id: req.params.id,
    });

    // Case, validation error
    if (!errors.isEmpty()) {
      res.status(400).json({ user: user, errors: errors.array() });
      return;
    }

    // Hash password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, return error response
      if (err) {
        res.status(500).json({ error: "Password hash error" });
        return;
      }
      // otherwise, store hashedPassword in DB
      try {
        user.password = hashedPassword;
        await User.findByIdAndUpdate(req.params.id, user, {});
        res.status(200).json({ user, message: "Update Successful" });
      } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
    });
  }),
];

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = User.findByIdAndDelete(req.params.id, { new: true });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});
