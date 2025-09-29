// routes/business.js - Business info routes
import express from "express";
import {
  getBusinessInfo,
  createOrUpdateBusinessInfo,
  deleteServiceFromBusiness,
} from "../controllers/businessController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Get business info (public)
router.get("/", getBusinessInfo);

// Create/update business info (admin only)
router.post("/", auth, isAdmin, createOrUpdateBusinessInfo);

// Delete service by ID (admin only)
router.delete("/services/:id", auth, isAdmin, deleteServiceFromBusiness);

export default router;