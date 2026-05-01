import mongoose from "mongoose";

const couponClickSchema = new mongoose.Schema({
  couponId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Coupon",
    required: true 
  },
  storeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Store" 
  },
  clickedAt: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: String,
  userAgent: String
});

export default mongoose.model("CouponClick", couponClickSchema);
