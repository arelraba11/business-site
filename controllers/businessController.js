import BusinessInfo from "../models/BusinessInfo.js";

// Get business info (single document)
export const getBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findOne();
    if (!info) return res.json(null);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete service from business info (by ID)
export const deleteServiceFromBusiness = async (req, res) => {
  try {
    const business = await BusinessInfo.findOne();
    if (!business) return res.status(404).json({ message: "Business not found" });

    business.prices = business.prices.filter(
      (service) => service._id.toString() !== req.params.id
    );

    await business.save();
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update business info
export const createOrUpdateBusinessInfo = async (req, res) => {
  try {
    let info = await BusinessInfo.findOne();

    if (info) {
      if (req.body.name) info.name = req.body.name;
      if (req.body.prices) info.prices = req.body.prices;
      if (req.body.socialLinks) info.socialLinks = req.body.socialLinks;
      if (req.body.openingHours) info.openingHours = req.body.openingHours;

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