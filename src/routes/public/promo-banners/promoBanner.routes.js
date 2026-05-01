import express from "express";
import PromoBanner from "../../../models/PromoBanner.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const { placement } = req.query;
    const query = { isActive: true };
    if (placement) query.placement = { $in: [placement, 'both'] };
    const banners = await PromoBanner.find(query).sort({ order: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
