import express from "express";
import { getBusinessInfo, createOrUpdateBusinessInfo } from "../controllers/businessController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Fetch the business info
router.get("/", getBusinessInfo);

// Create or update business info
router.post("/", auth, isAdmin, createOrUpdateBusinessInfo);

export default router;