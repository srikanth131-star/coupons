import mongoose from 'mongoose';

const footerLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

const footerSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['links', 'social', 'download', 'extension', 'bottom'],
    required: true
  },
  links: [footerLinkSchema],
  content: {
    type: String,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const footerSchema = new mongoose.Schema({
  sections: [footerSectionSchema],
  copyright: {
    type: String,
    default: '© 2026 Coupons Script. All rights reserved.'
  },
  logo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Footer || mongoose.model('Footer', footerSchema);