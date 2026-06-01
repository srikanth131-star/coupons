import express from "express";
import * as featuredCouponController from "../../../controllers/featuredCouponController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN FEATURED COUPONS APIs (4 endpoints)
// ==========================================

// GET /api/admin/featured-coupons - List featured coupons
router.get("/", featuredCouponController.getFeaturedCoupons);

// GET /api/admin/featured-coupons/list - List featured coupons (alias)
router.get("/list", featuredCouponController.getFeaturedCoupons);

// POST /api/admin/featured-coupons/create - Create featured coupon
router.post("/create", featuredCouponController.createFeaturedCoupon);

// PUT /api/admin/featured-coupons/:id - Update featured coupon
router.put("/:id", featuredCouponController.updateFeaturedCoupon);

// PUT /api/admin/featured-coupons/update/:id - Update featured coupon (alias)
router.put("/update/:id", featuredCouponController.updateFeaturedCoupon);

// DELETE /api/admin/featured-coupons/:id - Delete featured coupon
router.delete("/:id", featuredCouponController.deleteFeaturedCoupon);

// DELETE /api/admin/featured-coupons/delete/:id - Delete featured coupon (alias)
router.delete("/delete/:id", featuredCouponController.deleteFeaturedCoupon);

export default router;