import mongoose from 'mongoose';

const featuredCouponSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: false,
    default: null
  },
  priority: {
    type: Number,
    default: 1
  },
  featured: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: false
  },
  href: {
    type: String,
    required: false
  },
  theme: {
    type: String,
    enum: ['white', 'purple'],
    default: 'white'
  },
  logo: {
    type: String,
    default: ''
  },
  logoWidth: {
    type: Number,
    default: 40
  },
  logoHeight: {
    type: Number,
    default: 40
  },
  logoAlt: {
    type: String,
    default: ''
  },
  cta: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.FeaturedCoupon || mongoose.model('FeaturedCoupon', featuredCouponSchema);