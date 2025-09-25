import BusinessInfo from "../models/BusinessInfo.js";

// Fetch the business info document (only one expected).
export const getBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findOne();
    // If no business info found, return null.
    if (!info) {
      return res.json(null);
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new business info document or update the existing one.
export const createOrUpdateBusinessInfo = async (req, res) => {
  try {
    let info = await BusinessInfo.findOne();
    if (info) {
      // Update existing document with new data.
      info.set(req.body);
      await info.save();
      return res.json(info);
    } else {
      // If no document exists, create a new one.
      const newBusiness = new BusinessInfo(req.body);
      await newBusiness.save();
      return res.json(newBusiness);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};