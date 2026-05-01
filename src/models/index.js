import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Tag = mongoose.model("Tag", tagSchema);

const couponClickSchema = new mongoose.Schema({
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

export const CouponClick = mongoose.model("CouponClick", couponClickSchema);

// Export Notification model
export { Notification } from './Notification.js';
