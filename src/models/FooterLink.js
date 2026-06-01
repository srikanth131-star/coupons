import mongoose from 'mongoose';

const footerLinkSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed, default: () => new mongoose.Types.ObjectId() },
  label: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    enum: ['main', 'myRmn', 'bottom'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.FooterLink || mongoose.model('FooterLink', footerLinkSchema);