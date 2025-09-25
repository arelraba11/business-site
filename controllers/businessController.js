import BusinessInfo from "../models/BusinessInfo.js";

// Get business info
export const getBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findOne();
    if (!info) {
      return res.json(null);
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update business info
export const createOrUpdateBusinessInfo = async (req, res) => {
  try {
    let info = await BusinessInfo.findOne();
    if (info) {
      info.set(req.body);
      await info.save();
      return res.json(info);
    } else {
      const newBusiness = new BusinessInfo(req.body);
      await newBusiness.save();
      return res.json(newBusiness);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};