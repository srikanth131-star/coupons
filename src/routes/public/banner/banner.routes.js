import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC BANNER APIs (1 endpoint)
// ==========================================

// GET /api/public/banner/list - Get banners
router.get("/list", cmsController.getBanners);

export default router;