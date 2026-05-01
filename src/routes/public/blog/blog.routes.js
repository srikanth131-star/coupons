import express from "express";
import BlogArticle from "../../../models/BlogArticle.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const articles = await BlogArticle.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/details/:slug", async (req, res) => {
  try {
    const article = await BlogArticle.findOne({ slug: req.params.slug, isActive: true });
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
