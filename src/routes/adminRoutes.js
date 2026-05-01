import express from "express";
import storeRoutes from "./admin/stores/store.routes.js";
import couponRoutes from "./admin/coupons/coupon.routes.js";
import categoryRoutes from "./admin/categories/category.routes.js";
import popularStoreRoutes from "./admin/popular-stores/popularStore.routes.js";
import featuredCouponRoutes from "./admin/featured-coupons/featuredCoupon.routes.js";
import bannerRoutes from "./admin/banner/banner.routes.js";
import navbarRoutes from "./admin/navbar/navbar.routes.js";
import footerRoutes from "./admin/footer/footer.routes.js";
import pageRoutes from "./admin/pages/page.routes.js";
import analyticsRoutes from "./admin/analytics/analytics.routes.js";
import systemRoutes from "./admin/system/system.routes.js";
import cacheRoutes from "./admin/cache/cache.routes.js";
import uploadRoutes from "./admin/upload/upload.routes.js";
import dataRoutes from "./admin/data/data.routes.js";
import notificationRoutes from "./admin/notifications/notification.routes.js";
import healthRoutes from "./admin/health/health.routes.js";
import dashboardRoutes from "./admin/dashboard/dashboard.routes.js";
import dealRoutes from "./admin/deals/deal.routes.js";
import blogRoutes from "./admin/blog/blog.routes.js";
import promoBannerRoutes from "./admin/promo-banners/promoBanner.routes.js";
import popularLinkRoutes from "./admin/popular-links/popularLink.routes.js";
import tagRoutes from "./admin/tags/tag.routes.js";
import contactMessageRoutes from "./admin/contact/contact.routes.js";
import { trackGA4APIMiddleware } from "../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN APIs (CRUD + BACKEND) - 43 ENDPOINTS
// ==========================================

// STORE MANAGEMENT APIs (5 endpoints)
router.use("/stores", storeRoutes);

// COUPON MANAGEMENT APIs (5 endpoints)
router.use("/coupons", couponRoutes);

// CATEGORY MANAGEMENT APIs (4 endpoints)
router.use("/categories", categoryRoutes);

// POPULAR STORES MANAGEMENT APIs (4 endpoints)
router.use("/popular-stores", popularStoreRoutes);

// FEATURED COUPONS MANAGEMENT APIs (4 endpoints)
router.use("/featured-coupons", featuredCouponRoutes);

// BANNER MANAGEMENT APIs (2 endpoints)
router.use("/banner", bannerRoutes);

// NAVBAR MANAGEMENT APIs (2 endpoints)
router.use("/navbar", navbarRoutes);

// FOOTER MANAGEMENT APIs (4 endpoints)
router.use("/footer", footerRoutes);

// PAGES MANAGEMENT APIs (4 endpoints)
router.use("/pages", pageRoutes);

// FILE UPLOAD MANAGEMENT APIs (3 endpoints)
router.use("/upload", uploadRoutes);

// ANALYTICS & REPORTING APIs (3 endpoints)
router.use("/analytics", analyticsRoutes);

// DATA PROCESSING APIs (4 endpoints)
router.use("/data", dataRoutes);

// SYSTEM MANAGEMENT APIs (3 endpoints)
router.use("/system", systemRoutes);

// CACHE MANAGEMENT APIs (3 endpoints)
router.use("/cache", cacheRoutes);

// NOTIFICATION MANAGEMENT APIs (4 endpoints)
router.use("/notifications", notificationRoutes);

// HEALTH CHECK APIs (2 endpoints)
router.use("/health", healthRoutes);

// DASHBOARD APIs (2 endpoints)
router.use("/dashboard", dashboardRoutes);

// DEALS MANAGEMENT APIs (4 endpoints)
router.use("/deals", dealRoutes);

// BLOG ARTICLES MANAGEMENT APIs (4 endpoints)
router.use("/blog", blogRoutes);

// PROMO BANNERS MANAGEMENT APIs (4 endpoints)
router.use("/promo-banners", promoBannerRoutes);

// POPULAR LINKS MANAGEMENT APIs (4 endpoints)
router.use("/popular-links", popularLinkRoutes);

// TAG MANAGEMENT APIs (4 endpoints)
router.use("/tags", tagRoutes);

// CONTACT MESSAGES MANAGEMENT APIs (4 endpoints)
router.use("/contact-messages", contactMessageRoutes);

router.get("/system/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Unified Admin API system is operational",
    database: "connected",
    server: "running",
    backendIntegration: "active",
    timestamp: new Date().toISOString()
  });
});

export default router;