import mongoose from "mongoose";

const promoBannerSchema = new mongoose.Schema({
  logo: { type: String, default: 'amazon' },
  text: { type: String, required: true },
  buttonLabel: { type: String, default: 'Get Deal' },
  storeName: { type: String, default: '' },
  storeUrl: { type: String, default: '' },
  couponCode: { type: String, default: '' },
  discount: { type: String, default: '' },
  expiryDate: Date,
  details: { type: String, default: '' },
  gradient: { type: String, default: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)' },
  placement: { type: String, enum: ['inline', 'sticky', 'both'], default: 'both' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("PromoBanner", promoBannerSchema);
