const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.createPost = [
  // Validate and sanitize fields')
  body(
    "title",
    "Title must not be empty and must not have more than 100 characters."
  )
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
  body("published", "Published must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("created_at", "Created at must not be empty.")
    .trim()
    .default(Date.now())
    .escape(),
  body("source").optional({ checkFalsy: true }).trim().escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a post object with escaped and trimmed data
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image_url: req.body.image_url,
      published: req.body.published,
      created_at: req.body.created_at,
      author: req.user._id, // req.user is set in the auth middleware
    });

    // Check for errors
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Data from form is valid
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      console.error("Failed to save post:", error);
      res.status(500).json({ error: "Failed to save post" });
    }
  }),
];

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ created_at: -1 })
    .populate("author")
    .exec();

  res.status(200).json(posts);
});

exports.getPublishedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ published: true })
    .populate("author")
    .sort({ created_at: -1 })
    .exec();

  res.status(200).json(posts);
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author").exec();

  res.status(200).json(post);
});

exports.updatePost = [
  // Validate and sanitize fields')
  body(
    "title",
    "Title must not be empty and must not have more than 100 characters."
  )
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
  body("published", "Published must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("source").optional({ checkFalsy: true }).trim().escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a post object with escaped and trimmed data
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
      image_url: req.body.image_url,
      published: req.body.published,
      created_at: Date.now(),
      author: req.user._id, // req.user is set in the auth middleware
      _id: req.params.id,
      source: req.body.source,
    };

    // Check for errors
    if (!errors.isEmpty()) {
      // There are errors. Respond with sanitized values/error messages
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Data from form is valid
      // Save post
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
        }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Failed to update post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }),
];

exports.deletePost = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id, { new: true });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json({ post, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
