const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("../auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Index route");
});

// Handle signup
router.post("/users", userController.createUser);

// Handle login
router.post("/login", authController.loginController);

// Handle login
router.post(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Protected route");
  }
);

module.exports = router;
