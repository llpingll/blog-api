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
      type: "user",
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
  const users = await User.find().exec();

  res.status(200).json(users);
});

exports.getUser = asyncHandler(async (req, res) => {
  // Find the user based on the ID from the request parameters
  const user = await User.findById(req.params.id).exec();

  // Check if the user exists
  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  // Check if the current user is not the owner of the requested user object and is not an admin
  if (req.user._id.toString() !== req.params.id && req.user.type !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // If either the user is the owner or an admin, return the user object
  return res.status(200).json(user);
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
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("type", "Type must not be empty and must be either admin or user.")
    .optional()
    .trim()
    .notEmpty()
    .escape()
    .custom((value, { req }) => {
      if (req.user.type !== "admin") {
        throw new Error("Only admins can update the user type");
      }
      if (value !== "admin" && value !== "user") {
        throw new Error("Invalid user type");
      }
      return true;
    }),
  // .isIn(["admin", "user"]),

  // Process sanitized data
  asyncHandler(async (req, res, next) => {
    // Get validation result object
    const errors = validationResult(req);

    // Case, validation error
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check if the current user is not the owner of the requested user object and is not an admin
    // prettier-ignore
    if (req.user._id.toString() !== req.params.id && req.user.type !== "admin") {
      return res.status(403).json({ error: "Forbidden: Users can only be updated by owners or admin" });
    }

    // Create object with fields to update
    const updateData = {
      name: req.body.name,
      email: req.body.email,
    };

    // Only admins can update the `type` field
    if (req.user.type === "admin" && req.body.type) {
      updateData.type = req.body.type;
    }

    // Hash the new password if provided
    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, return error response
        if (err) {
          res.status(500).json({ error: "Password hash error" });
          return;
        }
        // otherwise, store hashedPassword in DB
        try {
          updateData.password = hashedPassword;
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
          );
          res
            .status(200)
            .json({ user: updatedUser, message: "Update Successful" });
        } catch (error) {
          next(error);
        }
      });
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );
        res
          .status(200)
          .json({ user: updatedUser, message: "Update Successful" });
      } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  }),
];

exports.deleteUser = asyncHandler(async (req, res) => {
  // Check if the current user is not the owner of the requested user object and is not an admin
  // prettier-ignore
  if (req.user._id.toString() !== req.params.id && req.user.type !== "admin") {
      return res.status(403).json({ error: "Forbidden: Users can only be deleted by owners or admin" });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id, { new: true });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user, message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
