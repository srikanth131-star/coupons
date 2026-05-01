import express from "express";
import * as couponController from "../../../controllers/couponController.js";
import * as analyticsController from "../../../controllers/analyticsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC COUPON APIs (6 endpoints)
// ==========================================

// GET /api/public/coupons - Get all coupons (clean URL)
router.get("/", couponController.getCoupons);

// GET /api/public/coupons/list - Get all coupons (legacy)
router.get("/list", couponController.getCoupons);

// GET /api/public/coupons/details/:id - Get coupon by ID
router.get("/details/:id", couponController.getCouponById);

// GET /api/public/coupons/search - Search coupons
router.get("/search", analyticsController.searchCoupons);

// GET /api/public/coupons/trending - Get trending coupons
router.get("/trending", analyticsController.getTrendingCoupons);

// POST /api/public/coupons/reveal/:id - Reveal coupon code
router.post("/reveal/:id", analyticsController.revealCoupon);

// POST /api/public/coupons/track-click/:id - Track coupon click
router.post("/track-click/:id", couponController.trackClick);

export default router;