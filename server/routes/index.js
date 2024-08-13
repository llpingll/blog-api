const express = require("express");
const router = express.Router();
const createUser = require("../controllers/userController/createUser");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Index route");
});

// Handle signup
router.post("/users", createUser);

// Handle login
router.post("/login", (req, res) => {
  // Authenticate username and password
});

module.exports = router;
