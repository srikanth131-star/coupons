import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC NAVBAR APIs (2 endpoints)
// ==========================================

// GET /api/public/navbar/items - Get active navbar items (public)
router.get("/items", cmsController.getPublicNavbarItems);

// GET /api/public/navbar/navigation - Get navigation
router.get("/navigation", cmsController.getNavigation);

export default router;