import express from "express";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN DATA PROCESSING APIs (4 endpoints)
// ==========================================

// POST /api/admin/data/bulk-import/coupons - Bulk import coupons
router.post("/bulk-import/coupons", async (req, res) => {
  try {
    // Validate content-type
    if (!req.is('application/json')) {
      return res.status(415).json({ error: "Content-Type must be application/json" });
    }

    // Validate request body exists
    if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    // Validate data structure
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Data must be an array" });
    }

    // Validate each coupon object
    for (const coupon of req.body) {
      if (!coupon.title || !coupon.code || !coupon.store) {
        return res.status(400).json({ error: "Each coupon must have title, code, and store" });
      }
    }

    res.json({
      message: "Bulk coupon import initiated",
      jobId: "bulk_import_" + Date.now(),
      status: "processing"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/data/bulk-import/stores - Bulk import stores
router.post("/bulk-import/stores", async (req, res) => {
  try {
    // Validate content-type
    if (!req.is('application/json')) {
      return res.status(415).json({ error: "Content-Type must be application/json" });
    }

    // Validate request body exists
    if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    // Validate data structure
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Data must be an array" });
    }

    // Validate each store object
    for (const store of req.body) {
      if (!store.name || !store.slug) {
        return res.status(400).json({ error: "Each store must have name and slug" });
      }
    }

    res.json({
      message: "Bulk store import initiated",
      jobId: "bulk_import_stores_" + Date.now(),
      status: "processing"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/data/export/coupons - Export coupons data
router.get("/export/coupons", async (req, res) => {
  try {
    res.json({
      message: "Coupon data export",
      exportUrl: "/downloads/coupons_export_" + Date.now() + ".csv",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/data/export/stores - Export stores data
router.get("/export/stores", async (req, res) => {
  try {
    res.json({
      message: "Store data export",
      exportUrl: "/downloads/stores_export_" + Date.now() + ".csv",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;