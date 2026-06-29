import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    logo: String,
    websiteUrl: String,
    description: String,
    category: String,
    // SEO / meta data (editable from admin) — used by the store detail page
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    section: { type: String, default: '' },
    discount: { type: String, default: '' },
    displayImage: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    // Homepage section card fields (used when the store is placed in a homepage section)
    code: { type: String, default: '' },
    tags: { type: [String], default: [] },
    expiryDate: { type: String, default: '' },
    details: { type: String, default: '' },
    limitedTime: { type: Boolean, default: false },
    expiringToday: { type: Boolean, default: false },
    exclusive: { type: Boolean, default: false },
    brandLogo: { type: String, default: '' },
    productUrl: { type: String, default: '' },
    affiliateUrl: { type: String, default: '' },
    type: { type: String, default: 'deal' },
    labelType: { type: String, default: 'Deal' },
    interestedUsers: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    addedBy: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    promoInfo: {
      heading: { type: String, default: '' },
      logoBgColor: { type: String, default: '#fef9c3' },
      logoText: { type: String, default: '' },
      sections: { type: [{ title: String, body: String }], default: [] }
    },
    storeInfo: {
      heading: { type: String, default: '' },
      subheading: { type: String, default: '' },
      sales: { type: [{ title: String, desc: String }], default: [] }
    },
    aboutSection: {
      heading: { type: String, default: '' },
      paragraphs: { type: [String], default: [] }
    },
    sidebarData: {
      authorName:           { type: String, default: '' },
      authorRole:           { type: String, default: '' },
      authorImage:          { type: String, default: '' },
      authorBio:            { type: String, default: '' },
      authorBioUrl:         { type: String, default: '' },
      trustText:            { type: String, default: '' },
      lastVerified:         { type: String, default: '' },
      howToSteps:           { type: [String], default: [] },
      featuredArticleImage: { type: String, default: '' },
      featuredArticleTitle: { type: String, default: '' },
      featuredArticleDesc:  { type: String, default: '' },
      featuredArticleAuthor:{ type: String, default: '' },
      featuredArticleUrl:   { type: String, default: '' },
      storeAddress:         { type: String, default: '' },
      storeRating:          { type: Number, default: 5 },
      storeRatingCount:     { type: Number, default: 0 },
      inStoreCoupons:       { type: Number, default: 0 },
      commissionNote:       { type: String, default: '' }
    },
    faqs: {
      heading: { type: String, default: '' },
      items: { type: [{ question: String, answer: String }], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
