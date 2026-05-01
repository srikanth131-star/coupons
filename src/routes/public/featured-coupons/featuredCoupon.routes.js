import express from "express";
import * as featuredCouponController from "../../../controllers/featuredCouponController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC FEATURED COUPONS APIs (1 endpoint)
// ==========================================

// GET /api/public/featured-coupons/list - Get featured coupons
router.get("/list", featuredCouponController.getFeaturedCoupons);

export default router;