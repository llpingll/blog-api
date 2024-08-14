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
  asyncHandler((req, res) => {
    const errors = validationResult(req);

    // Case, validation error
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check if user exists
    const existingUser = User.findOne({ email: req.body.email });
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
        password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Signup Successful" });
      } catch (error) {
        console.error("Failed to save user:", error);
        res.status(500).json({ error: "Failed to save user" });
      }
    });
  }),
];
