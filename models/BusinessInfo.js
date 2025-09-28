import mongoose from "mongoose";

const businessInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
  },
  openingHours: {
    type: Map,
    of: String,
  },
  prices: [
    {
      service: String,
      price: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BusinessInfo = mongoose.model("BusinessInfo", businessInfoSchema);
export default BusinessInfo;