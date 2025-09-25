
import Post from "../models/Post.js";

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    await post.save();
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    // Handle errors (e.g., validation, database)
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a post by ID
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