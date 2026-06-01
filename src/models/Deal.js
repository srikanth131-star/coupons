import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discount: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  category: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  logo: { type: String, default: '' },
  type: { type: String, enum: ['deal', 'offer', 'clearance', 'flash'], default: 'deal' },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  section: { type: String, enum: ['popular_offers', 'popular_stores', 'top_coupons', 'deals_of_day', 'collections', 'trending_deals', ''], default: '' },
  clickCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Deal", dealSchema);
