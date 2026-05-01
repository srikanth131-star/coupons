import mongoose from "mongoose";

const contentParagraphSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
}, { _id: false });

const designSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Advanced'], default: 'Easy' },
  note: { type: String, default: '' },
  noteUrl: { type: String, default: '' },
  noteLinkText: { type: String, default: '' },
}, { _id: false });

const relatedPostSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  image: { type: String, default: '' },
  date: { type: String, default: '' },
  category: { type: String, default: '' },
  slug: { type: String, default: '' },
}, { _id: false });

const blogArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  content: [{ type: String }],
  contentParagraphs: [contentParagraphSchema],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  // Rich article layout fields
  heroImage: { type: String, default: '' },
  dateLabel: { type: String, default: '' },
  introduction: { type: String, default: '' },
  author: {
    name: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  introSection: {
    heading: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  collectionSection: {
    label: { type: String, default: '' },
    heading: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  designs: [designSchema],
  wrapUp: { type: String, default: '' },
  relatedPosts: [relatedPostSchema],
  useRichLayout: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("BlogArticle", blogArticleSchema);
