import Post from "../models/Post.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content && !image) {
      return res.status(400).json({ message: "Content or image is required" });
    }

    const post = new Post({ content, image, author: req.user.id });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts (newest first)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post by ID
export const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};