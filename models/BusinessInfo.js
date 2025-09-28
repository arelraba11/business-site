import mongoose from "mongoose";

const businessInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  socialLinks: {
    facebook: String, // Facebook page URL
    instagram: String, // Instagram profile URL
    tiktok: String // TikTok profile URL
  },
  openingHours: {
    type: Map,
    of: String // Map of days to opening hours (e.g., "Monday": "9am-5pm")
  },
  prices: [
    {
      service: String, // Name of the service offered
      price: Number // Price for the service
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now // Timestamp of document creation
  }
});

const BusinessInfo = mongoose.model("BusinessInfo", businessInfoSchema);
export default BusinessInfo;