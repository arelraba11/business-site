import {
  getBusinessInfoService,
  deleteServiceFromBusinessService,
  createOrUpdateBusinessInfoService,
} from "../services/businessService.js";

// Get business info
export const getBusinessInfo = async (req, res) => {
  try {
    const info = await getBusinessInfoService();
    if (!info) return res.json(null);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete service
export const deleteServiceFromBusiness = async (req, res) => {
  try {
    const business = await deleteServiceFromBusinessService(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create/update business info
export const createOrUpdateBusinessInfo = async (req, res) => {
  try {
    const updated = await createOrUpdateBusinessInfoService(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};