import BusinessInfo from "../models/BusinessInfo.js";

// Validate opening hours format: "HH:MM-HH:MM" or empty
function isValidTimeRange(value) {
  if (!value) return true; // allow empty/Closed
  const regex = /^([01]\d|2[0-3]):(00|30)-([01]\d|2[0-3]):(00|30)$/;
  return regex.test(value);
}

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
    const { name, socialLinks, openingHours, prices } = req.body;

    // Validate opening hours if provided
    if (openingHours) {
      for (const [day, value] of Object.entries(openingHours)) {
        if (!isValidTimeRange(value)) {
          return res.status(400).json({
            error: `Invalid time format for ${day}. Use "HH:MM-HH:MM" (e.g. "09:00-17:30") or leave empty.`,
          });
        }
      }
    }

    const updated = await BusinessInfo.findOneAndUpdate(
      {},
      { name, socialLinks, openingHours, prices },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};