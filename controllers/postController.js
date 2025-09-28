import Post from "../models/Post.js";

// Creates a new post with the logged-in user as author
const createPost = async (req, res) => {
  // Extract request body and save new post to DB
  try {
    const { content, image } = req.body;
    // Validate inputs
    if (!content && !image) {
      return res.status(400).json({ success: false, message: "Either content or image is required" });
    }
    // Author is taken from the logged-in user (via token)
    const post = new Post({ content, image, author: req.user.id });
    await post.save();
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    // Handle DB or validation errors
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all posts sorted by creation date (newest first)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete post by ID (returns 404 if not found)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    return res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createPost, getPosts, deletePost };