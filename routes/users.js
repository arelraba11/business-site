// routes/users.js - Authentication routes
import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login existing user
router.post("/login", loginUser);

export default router;