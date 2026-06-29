import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  // SEO / meta data (editable from admin)
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  discount: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  logo: { type: String, default: '' },
  code: { type: String, default: '' },
  type: { type: String, enum: ['deal', 'offer', 'clearance', 'flash'], default: 'deal' },
  labelType: { type: String, default: 'Deal' },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  limitedTime: { type: Boolean, default: false },
  expiringToday: { type: Boolean, default: false },
  exclusive: { type: Boolean, default: false },
  section: { type: String, enum: ['popular_offers', 'popular_stores', 'top_coupons', 'deals_of_day', 'collections', 'trending_deals', ''], default: '' },
  interestedUsers: { type: Number, default: 0 },
  addedBy: { type: String, default: '' },
  details: { type: String, default: '' },
  affiliateUrl: { type: String, default: '' },
  clickCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Deal", dealSchema);
