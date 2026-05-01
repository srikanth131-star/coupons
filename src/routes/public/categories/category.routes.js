import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC CATEGORY APIs (1 endpoint)
// ==========================================

// GET /api/public/categories/list - Get all categories
router.get("/list", categoryController.getCategories);

export default router;