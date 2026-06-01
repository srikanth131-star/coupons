import mongoose from 'mongoose';

const popularStoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  logo: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#007bff'
  },
  description: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  hasNavLink: {
    type: Boolean,
    default: false
  },
  navLocation: {
    type: String,
    enum: ['navbar', 'footer', 'both', 'no'],
    default: 'no'
  },
  dropdownSection: {
    type: String,
    enum: ['categories', 'popular'],
    default: 'popular'
  },
  priority: {
    type: Number,
    default: 1
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: true
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.PopularStore || mongoose.model('PopularStore', popularStoreSchema);