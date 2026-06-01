import mongoose from "mongoose";

const popularLinkSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed },
  name: { type: String, required: true },
  href: { type: String, default: '#' },
  type: { type: String, enum: ['category', 'store'], required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("PopularLink", popularLinkSchema);
