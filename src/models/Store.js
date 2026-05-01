import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    logo: String,
    websiteUrl: String,
    description: String,
    category: String,
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
