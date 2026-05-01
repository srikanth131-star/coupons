import mongoose from 'mongoose';

// Clear any existing model to ensure fresh validation
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: [100, 'Category slug cannot exceed 100 characters'],
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  color: {
    type: String,
    default: '#007bff'
  },
  icon: {
    type: String,
    default: ''
  },
  description: {
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
    default: 'categories'
  }
}, {
  timestamps: true
});

// Pre-validate hook to check slug format before lowercase transformation
categorySchema.pre('validate', function() {
  if (this.slug && !/^[a-zA-Z0-9-]+$/.test(this.slug)) {
    this.invalidate('slug', 'Slug can only contain letters, numbers, and hyphens');
  }
  if (this.slug) {
    this.slug = this.slug.toLowerCase();
  }
});

export default mongoose.model('Category', categorySchema);