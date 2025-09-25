import express from "express";
import { getBusinessInfo, createOrUpdateBusinessInfo } from "../controllers/businessController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// GET /business - Retrieve business information
router.get("/", getBusinessInfo);

// POST /business - Create or update business information (admin only)
router.post("/", auth, isAdmin, createOrUpdateBusinessInfo);

export default router;