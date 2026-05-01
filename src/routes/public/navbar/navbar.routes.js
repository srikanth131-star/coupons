import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC NAVBAR APIs (1 endpoint)
// ==========================================

// GET /api/public/navbar/navigation - Get navigation
router.get("/navigation", cmsController.getNavigation);

export default router;