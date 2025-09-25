import express from "express";
import BusinessInfo from "../models/BusinessInfo.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Fetch the business info (returns null if not set)
router.get("/", async (req, res) => {
  try {
    const info = await BusinessInfo.findOne();
    if (!info) {
      return res.json(null);
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update the business info
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    let info = await BusinessInfo.findOne();
    if (info) {
      // Update existing business info
      info.set(req.body);
      await info.save();
      return res.json(info);
    } else {
      // Create new business info
      const newBusiness = new BusinessInfo(req.body);
      await newBusiness.save();
      return res.json(newBusiness);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;