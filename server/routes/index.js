const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const { passport, ensureAdmin } = require("../auth");

// Handle login
router.post("/login", authController.loginController);

// Handle users
router.get("/users", passport.authenticate("jwt", { session: false }), ensureAdmin, userController.getAllUsers);
router.get("/users/:id", passport.authenticate("jwt", { session: false }), userController.getUser);
router.post("/users", userController.createUser);
router.put("/users/:id", passport.authenticate("jwt", { session: false }), userController.updateUser);
router.delete("/users/:id", passport.authenticate("jwt", { session: false }), userController.deleteUser);

// Handle posts
router.get("/post",passport.authenticate("jwt", { session: false }), ensureAdmin, postController.getAllPosts);
router.get("/post/published", postController.getPublishedPosts);
router.get("/post/:id", postController.getPost);
router.post("/post", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.createPost);
router.put("/post/:id", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.updatePost);
router.delete("/post/:id", passport.authenticate("jwt", { session: false }), ensureAdmin, postController.deletePost);

// Handle comments
router.get("/post/:postId/comments", commentController.getAllPostComments);
router.get("/post/:postId/comments/:id", commentController.getComment);
router.post("/post/:postId/comments", passport.authenticate("jwt", { session: false }), commentController.createComment);
router.put("/post/:postId/comments/:id", passport.authenticate("jwt", { session: false }), commentController.updateComment);
router.delete("/post/:postId/comments/:id", passport.authenticate("jwt", { session: false }), commentController.deleteComment);

module.exports = router;