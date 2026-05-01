import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN BANNER APIs (2 endpoints)
// ==========================================

// GET /api/admin/banner - List ALL banners (including inactive)
router.get("/", async (req, res) => {
  const { Banner } = await import("../../../models/Banner.js");
  try {
    const banners = await Banner.find().populate('store', 'storeName slug').sort({ createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/banner/create - Create banner
router.post("/create", cmsController.createBanner);

// PUT /api/admin/banner/update/:id - Update banner
router.put("/update/:id", cmsController.updateBanner);

// DELETE /api/admin/banner/delete/:id - Delete banner
router.delete("/delete/:id", cmsController.deleteBanner);

export default router;