import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new post (auth required)
router.post("/", auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Post content is required." });
    }

    const post = new Post({
      content,
      image,
      author: req.user.id, // link post to logged-in user
    });

    await post.save();
    // Populate author before responding
    await post.populate("author", "username email");
    res.status(201).json({
      success: true,
      message: "Post created.",
      post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all posts (public)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a post (auth, only author)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    if (req.user.id !== post.author.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post." });
    }
    await post.deleteOne();
    res.json({ success: true, message: "Post deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;