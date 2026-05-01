import express from "express";
import PromoBanner from "../../../models/PromoBanner.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const banners = await PromoBanner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const banner = await PromoBanner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const banner = await PromoBanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, error: "Promo banner not found" });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const banner = await PromoBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: "Promo banner not found" });
    res.json({ success: true, message: "Promo banner deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
