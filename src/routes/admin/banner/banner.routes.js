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

// GET /api/admin/banner/list - List ALL banners (alias)
router.get("/list", async (req, res) => {
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

// POST /api/admin/banner/bulk-delete - Bulk delete banners
router.post("/bulk-delete", async (req, res) => {
  const mongoose = (await import("mongoose")).default;
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, error: 'No IDs provided' });
    const objectIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
    
    const db = mongoose.connection.db;
    const result = await db.collection('banners').deleteMany({ $or: [{ _id: { $in: objectIds } }, { _id: { $in: ids } }] });
    console.log(`[BULK DELETE BANNERS] Requested: ${ids.length}, Deleted: ${result.deletedCount}`);
    res.json({ success: true, message: `${result.deletedCount} banner(s) deleted` });
  } catch (error) {
    console.error(`[BULK DELETE BANNERS] Error:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;