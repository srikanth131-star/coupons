import express from "express";
import * as storeController from "../../../controllers/storeController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC STORE APIs (2 endpoints)
// ==========================================

// GET /api/public/stores/list - Get all stores
router.get("/list", storeController.getStores);

// GET /api/public/stores/details/:slug - Get store by slug
router.get("/details/:slug", storeController.getStoreBySlug);

export default router;