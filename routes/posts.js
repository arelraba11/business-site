import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { createPost, getPosts, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Create a new post (auth and admin required)
router.post("/", auth, isAdmin, createPost);

// Get all posts (public)
router.get("/", getPosts);

// Delete a post (auth and admin required)
router.delete("/:id", auth, isAdmin, deletePost);

export default router;