import BusinessInfo from "../models/BusinessInfo.js";
import { isValidTimeRange } from "../utils/timeUtils.js";

export const getBusinessInfoService = async () => {
  return await BusinessInfo.findOne();
};

export const deleteServiceFromBusinessService = async (id) => {
  const business = await BusinessInfo.findOne();
  if (!business) return null;

  business.prices = business.prices.filter(
    (service) => service._id.toString() !== id
  );
  await business.save();
  return business;
};

export const createOrUpdateBusinessInfoService = async (data) => {
  const { name, socialLinks, openingHours, prices } = data;

  if (openingHours) {
    for (const [day, value] of Object.entries(openingHours)) {
      if (!isValidTimeRange(value)) {
        throw new Error(
          `Invalid time format for ${day}. Use "HH:MM-HH:MM" (e.g. "09:00-17:30") or leave empty.`
        );
      }
    }
  }

  return await BusinessInfo.findOneAndUpdate(
    {},
    { name, socialLinks, openingHours, prices },
    { new: true, upsert: true }
  );
};