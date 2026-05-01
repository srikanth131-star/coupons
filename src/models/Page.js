import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  template: { type: String, default: 'default' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  sections: [{
    id: { type: String, required: true },
    order: { type: Number, required: true },
    type: { 
      type: String, 
      required: true,
      enum: [
        "heroBanner", 
        "textContent", 
        "featuredCoupons", 
        "trendingCoupons", 
        "topStores", 
        "latestCoupons", 
        "categories",
        "imageGallery",
        "contactForm",
        "customHTML",
        "storeGrid",
        "couponGrid",
        "popularOffers",
        "popularStores",
        "topCoupons",
        "dealsOfDay",
        "collections"
      ]
    },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    limit: { type: Number, default: 10 },
    backgroundColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    customCSS: { type: String, default: '' },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }]
}, { timestamps: true });

export const Page = mongoose.model("Page", pageSchema);