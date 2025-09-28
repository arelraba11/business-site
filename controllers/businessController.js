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

// Delete a specific service from business info
export const deleteServiceFromBusiness = async (req, res) => {
  try {
    const business = await BusinessInfo.findOne();
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Filter out the service by id
    business.prices = business.prices.filter(
      (service) => service._id.toString() !== req.params.id
    );

    await business.save();
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new business info document or update the existing one.
export const createOrUpdateBusinessInfo = async (req, res) => {
  try {
    let info = await BusinessInfo.findOne();

    if (info) {
      // Update only the fields that are provided in the request
      if (req.body.name) info.name = req.body.name;
      if (req.body.prices) info.prices = req.body.prices;
      if (req.body.socialLinks) info.socialLinks = req.body.socialLinks;
      if (req.body.openingHours) info.openingHours = req.body.openingHours;

      await info.save();
      return res.json(info);
    } else {
      // Create a new business if it doesn't exist
      const newBusiness = new BusinessInfo(req.body);
      await newBusiness.save();
      return res.json(newBusiness);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};