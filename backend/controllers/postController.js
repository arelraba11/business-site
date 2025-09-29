import {
  createNewPost,
  getAllPosts,
  deletePostById,
} from "../services/postService.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const post = await createNewPost({
      content: req.body.content,
      image: req.body.image,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    await deletePostById(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(err.message === "Post not found" ? 404 : 500).json({ error: err.message });
  }
};