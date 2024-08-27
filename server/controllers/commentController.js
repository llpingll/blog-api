const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
const comment = require("../models/comment");

exports.createComment = [
  // Validate and sanitize fields
  body(
    "content",
    "Content must not be empty and must not be more than 500 chars."
  )
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),

  // Process sanitized data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check for post existence
    const postExists = await Post.findById(req.params.postId);

    if (!postExists) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Create a new comment object with escaped and trimmed data
    const comment = new Comment({
      content: req.body.content,
      post: req.params.postId,
      timestamp: Date.now(),
      user: req.user._id,
    });

    try {
      // Data from form is valid
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      console.error("Failed to save comment:", error);
      res.status(500).json({ error: "Failed to save comment" });
    }
  }),
];

exports.getAllPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ timestamp: -1 })
    .populate("post")
    .populate("user")
    .exec();

  res.status(200).json(comments);
});

exports.getComment = asyncHandler(async (req, res) => {
  // Find comment
  const comment = await Comment.findById(req.params.id)
    .populate("post")
    .populate("user")
    .exec();

  // Check if comment exists
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
  }

  // Check if the current user is not the owner of the requested comment object and is not an admin
  if (!req.user._id.equals(comment.user._id) && req.user.type !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // If either the user is the owner or an admin, return the user object
  res.status(200).json(comment);
});

exports.updateComment = [
  // Validate and sanitize fields
  body(
    "content",
    "Content must not be empty and must not be more than 500 chars."
  )
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),

  // Process sanitized data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a new comment object with escaped and trimmed data
    const updatedData = {
      content: req.body.content,
      post: req.params.postId,
      timestamp: Date.now(),
      user: req.user._id,
    };

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check for user and post existence
    const commentExists = await Comment.findById(req.params.id);
    const postExists = await Post.findById(req.params.postId);

    if (!commentExists) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (!postExists) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Check if the current user is not the owner of the requested comment object
    // prettier-ignore
    if (!req.user._id.equals(commentExists.user._id)) {
      return res.status(403).json({ error: "Forbidden: Comments can only be updated by owners" });
    }

    try {
      // Data from form is valid
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      ).exec();
      res.status(200).json({ comment, message: "Update Successful" });
    } catch (error) {
      console.error("Failed to update comment:", error);
      res.status(500).json({ error: "Failed to update comment" });
    }
  }),
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
  try {
    const commentExists = await Comment.findById(req.params.id).exec();

    if (!commentExists) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    // Check if the current user is not the owner of the requested comment object
    // prettier-ignore
    if (!req.user._id.equals(commentExists.user._id) && req.user.type !== "admin") {
      return res.status(403).json({ error: "Forbidden: Comments can only be deleted by owners or admin" });
    }

    const comment = await Comment.findByIdAndDelete(req.params.id, {
      new: true,
    }).exec();

    res.status(200).json({ comment, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});
