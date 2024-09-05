const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Load environment variables from .env file if not in production (Check can be omitted)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.loginController = [
  // Sanitize input data
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

    // Case, vlidation error
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check for valid user
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(400).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    // Check password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(400).json({ errors: [{ msg: "Invalid password" }] });
      return;
    }

    // Issue JWT token
    try {
      const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        // RS256 is an asymmetric algorithm that uses a public/private key pair to sign/verify
        // HS256 is the default symmetric algorithm that uses only a private key to sign and verify
        // algorithm: "HS256",
        expiresIn: "2d",
      });
      res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ errors: [{ msg: "JWT issue error" }] });
    }
  }),
];
