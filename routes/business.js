import express from "express";
import {
  getBusinessInfo,
  createOrUpdateBusinessInfo,
  deleteServiceFromBusiness,
} from "../controllers/businessController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// GET /business - Retrieve business information
router.get("/", getBusinessInfo);

// POST /business - Create or update business information (admin only)
router.post("/", auth, isAdmin, createOrUpdateBusinessInfo);

// DELETE /business/services/:id - Remove a specific service (admin only)
router.delete("/services/:id", auth, isAdmin, deleteServiceFromBusiness);

export default router;