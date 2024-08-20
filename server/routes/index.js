const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { passport, ensureAdmin } = require("./auth");

// Handle login
router.post("/login", authController.loginController);

// Handle users
router.post("/users", userController.createUser);
router.get("/users", passport.authenticate("jwt", { session: false }), userController.getAllUsers);
router.get("/users/:id", passport.authenticate("jwt", { session: false }), userController.getUser);
router.put("/users/:id", passport.authenticate("jwt", passport.authenticate("jwt", { session: false }), { session: false }), userController.updateUser);
router.delete("/users/:id", passport.authenticate("jwt", passport.authenticate("jwt", { session: false }), { session: false }), userController.deleteUser);

// Handle posts
router.get("/post", postController.getAllPosts);
router.get("/post/published", postController.getPublishedPosts);
router.get("/post/:id", postController.getPost);
router.post("/post", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.createPost);
router.put("/post", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.updatePost);
router.delete("/post/:id", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.deletPost);

// Handle comments
router.get("/post/:postId/comments", postController.getAllPostComments);
router.get("/post/:postId/comments/:id", postController.getComment);
router.post("/post/:postId/comments", passport.authenticate("jwt", { session: false }), postController.createComment);
router.put("/post/:postId/comments/:id", passport.authenticate("jwt", { session: false }), postController.updateComment);
router.delete("/post/:postId/comments/:id", passport.authenticate("jwt", { session: false }), postController.deletComment);

module.exports = router;