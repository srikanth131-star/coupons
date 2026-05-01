import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC PAGES APIs (2 endpoints)
// ==========================================

// GET /api/public/pages/config - Get site configuration
router.get("/config", cmsController.getSiteConfig);

// GET /api/public/pages/analytics - Get analytics configuration
router.get("/analytics", cmsController.getAnalyticsConfig);

// GET /api/public/pages/:pageName - Get page content
router.get("/:pageName", cmsController.getPage);

export default router;