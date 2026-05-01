import express from "express";
import BlogArticle from "../../../models/BlogArticle.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const articles = await BlogArticle.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const article = await BlogArticle.create(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const article = await BlogArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const article = await BlogArticle.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, error: "No IDs provided" });
    const result = await BlogArticle.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} article(s) deleted` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
