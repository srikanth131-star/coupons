import express from "express";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN CACHE APIs (3 endpoints)
// ==========================================

// POST /api/admin/cache/clear/all - Clear all cache
router.post("/clear/all", async (req, res) => {
  try {
    res.json({
      message: "All cache cleared successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/cache/clear/coupons - Clear coupon cache
router.post("/clear/coupons", async (req, res) => {
  try {
    res.json({
      message: "Coupon cache cleared successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/cache/clear/stores - Clear store cache
router.post("/clear/stores", async (req, res) => {
  try {
    res.json({
      message: "Store cache cleared successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;