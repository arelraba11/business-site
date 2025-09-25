
// routes/users.js
import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

export default router;