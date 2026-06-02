import express from "express";
import BlogArticle from "../../../models/BlogArticle.js";
import mongoose from "mongoose";
import { buildIdFilter, cleanUpdateData } from "../../../utils/idHelper.js";

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
    const filter = buildIdFilter(req.params.id);
    const data = cleanUpdateData(req.body);
    const article = await BlogArticle.findOneAndUpdate(filter, data, { new: true });
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    const article = await BlogArticle.findOneAndDelete(filter);
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
    
    const db = mongoose.connection.db;
    const objectIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
    const result = await db.collection('blogarticles').deleteMany({ $or: [{ _id: { $in: objectIds } }, { _id: { $in: ids } }] });
    console.log(`[BULK DELETE BLOG] Requested: ${ids.length}, Deleted: ${result.deletedCount}`);
    res.json({ success: true, message: `${result.deletedCount} article(s) deleted` });
  } catch (error) {
    console.error(`[BULK DELETE BLOG] Error:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
