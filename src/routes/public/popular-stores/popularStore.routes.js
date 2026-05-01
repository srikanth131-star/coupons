import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC POPULAR STORES APIs (1 endpoint)
// ==========================================

// GET /api/public/popular-stores/list - Get popular stores
router.get("/list", categoryController.getPopularStores);

export default router;