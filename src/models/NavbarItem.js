import mongoose from 'mongoose';

const navbarItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self'
  },
  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const NavbarItem = mongoose.model('NavbarItem', navbarItemSchema);