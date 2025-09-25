// Routes for managing blog posts (create, read, delete)

import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { createPost, getPosts, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Route to create a new post (requires authentication and admin)
router.post("/", auth, isAdmin, createPost);

// Route to get all posts (public access)
router.get("/", getPosts);

// Route to delete a post by ID (requires authentication and admin)
router.delete("/:id", auth, isAdmin, deletePost);

export default router;