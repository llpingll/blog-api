const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.createComment = [
  // Validate and sanitize fields
  body(
    "content",
    "Content must not be empty and must not be more than 500 chars."
  )
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),
  body("user", "User must not be empty and must be a valid MongoId.")
    .trim()
    .isLength({ min: 1 })
    .isMongoId()
    .withMessage("Invalid user ID")
    .escape(),
  check("postId", "Post ID must be a valid MongoId.")
    .isMongoId()
    .withMessage("Invalid post ID"),

  // Process sanitized data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
      return;
    }

    // Check for user and post existence
    const userExists = await User.findById(req.body.user);
    const postExists = await Post.findById(req.params.postId);

    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

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
      await comment.save().exec();
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }),
];

exports.getAllPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postID })
    .sort({ timestamp: -1 })
    .populate("post")
    .populate("user")
    .exec();

  res.status(200).json({ comments });
});

exports.getComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate("post")
    .populate("user")
    .exec();

  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
  } else {
    res.status(200).json({ comment });
  }
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
  body("user", "User must not be empty and must be a valid MongoId.")
    .trim()
    .isLength({ min: 1 })
    .isMongoId()
    .withMessage("Invalid user ID")
    .escape(),
  check("postId", "Post ID must be a valid MongoId.")
    .isMongoId()
    .withMessage("Invalid post ID"),

  // Process sanitized data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a new comment object with escaped and trimmed data
    const comment = new Comment({
      content: req.body.content,
      post: req.params.postId,
      timestamp: Date.now(),
      user: req.user._id,
    });

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(500).json({ comment, errors: errors.array() });
      return;
    }

    // Check for user and post existence
    const userExists = await User.findById(req.body.user);
    const postExists = await Post.findById(req.params.postId);

    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!postExists) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    try {
      // Data from form is valid
      await Comment.findByIdAndUpdate(req.params.id, comment, {}).exec();
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }),
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
  try {
    const comment = Comment.findByIdAndDelete(req.params.id, { new: true });

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
});
