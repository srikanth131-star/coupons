import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  subtitle: { type: String },
  buttonText: { type: String },
  label: String,
  cta: String,
  image: String,
  bgColor: { type: String, default: '#ffffff' },
  textPanelBg: { type: String, default: '#ffffff' },
  textPanelMargin: { type: Number, default: 100 },
  buttonLink: String,
  storeUrl: String,
  couponCode: String,
  description: String,
  discount: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  expiryDate: Date,
  type: { type: String, enum: ['code', 'sale', 'cashback', 'freeshipping'], default: 'code' },
  labelType: { type: String, default: 'Code' },
  interestedUsers: { type: Number, default: 0 },
  addedBy: { type: String, default: '' },
  details: { type: String, default: '' },
  limitedTime: { type: Boolean, default: false },
  expiringToday: { type: Boolean, default: false },
  exclusive: { type: Boolean, default: false },
  secondaryImage: String,
  imagePosition: { type: String, enum: ['center', 'left', 'right', 'top', 'bottom'], default: 'right' },
  bannerType: { type: String, enum: ['hero_left', 'hero_right', 'fullwidth'], default: 'hero_left' },
  secondDiscount: { type: String, default: '' },
  secondDiscountDesc: { type: String, default: '' },
  emoji: { type: String, default: '' },
  cardBgColor: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Banner = mongoose.model("Banner", bannerSchema);
