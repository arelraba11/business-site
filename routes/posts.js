// routes/posts.js - Blog post routes
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { createPost, getPosts, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Create post (admin only)
router.post("/", auth, isAdmin, createPost);

// Get all posts (public)
router.get("/", getPosts);

// Delete post by ID (admin only)
router.delete("/:id", auth, isAdmin, deletePost);

export default router;