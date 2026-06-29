import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, default: '' },
  description: String,
  // SEO / meta data (editable from admin)
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  discount: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  expiryDate: Date,
  clickCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  featuredImage: { type: String, default: '' },
  type: { type: String, enum: ['code', 'sale', 'cashback', 'freeshipping'], default: 'code' },
  labelType: { type: String, default: 'Code' },
  interestedUsers: { type: Number, default: 0 },
  limitedTime: { type: Boolean, default: false },
  expiringToday: { type: Boolean, default: false },
  addedBy: { type: String, default: '' },
  exclusive: { type: Boolean, default: false },
  details: { type: String, default: '' },
  affiliateUrl: { type: String, default: '' },
  customLogo: { type: String, default: '' },
  section: { type: String, default: '' },
  displayImage: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
