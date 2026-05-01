import express from "express";
import storeRoutes from "./public/stores/store.routes.js";
import couponRoutes from "./public/coupons/coupon.routes.js";
import categoryRoutes from "./public/categories/category.routes.js";
import popularStoreRoutes from "./public/popular-stores/popularStore.routes.js";
import featuredCouponRoutes from "./public/featured-coupons/featuredCoupon.routes.js";
import bannerRoutes from "./public/banner/banner.routes.js";
import navbarRoutes from "./public/navbar/navbar.routes.js";
import footerRoutes from "./public/footer/footer.routes.js";
import pageRoutes from "./public/pages/page.routes.js";
import dealRoutes from "./public/deals/deal.routes.js";
import blogRoutes from "./public/blog/blog.routes.js";
import promoBannerRoutes from "./public/promo-banners/promoBanner.routes.js";
import popularLinkRoutes from "./public/popular-links/popularLink.routes.js";
import tagRoutes from "./public/tags/tag.routes.js";
import contactRoutes from "./public/contact/contact.routes.js";
import { trackGA4APIMiddleware } from "../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC APIs (READ-ONLY) - 15 ENDPOINTS
// ==========================================

// STORE PUBLIC APIs (2 endpoints)
router.use("/stores", storeRoutes);

// COUPON PUBLIC APIs (6 endpoints)
router.use("/coupons", couponRoutes);

// CATEGORY PUBLIC APIs (1 endpoint)
router.use("/categories", categoryRoutes);

// POPULAR STORES PUBLIC APIs (1 endpoint)
router.use("/popular-stores", popularStoreRoutes);

// FEATURED COUPONS PUBLIC APIs (1 endpoint)
router.use("/featured-coupons", featuredCouponRoutes);

// BANNER PUBLIC APIs (1 endpoint)
router.use("/site/banners", bannerRoutes);

// NAVBAR PUBLIC APIs (1 endpoint)
router.use("/navbar", navbarRoutes);

// FOOTER PUBLIC APIs (1 endpoint)
router.use("/footer", footerRoutes);

// PAGES PUBLIC APIs (2 endpoints)
router.use("/site", pageRoutes);

// DEALS PUBLIC APIs (2 endpoints)
router.use("/deals", dealRoutes);

// BLOG PUBLIC APIs (2 endpoints)
router.use("/blog", blogRoutes);

// PROMO BANNERS PUBLIC APIs (1 endpoint)
router.use("/promo-banners", promoBannerRoutes);

// POPULAR LINKS PUBLIC APIs (1 endpoint)
router.use("/popular-links", popularLinkRoutes);

// TAGS PUBLIC APIs (1 endpoint)
router.use("/tags", tagRoutes);

// CONTACT FORM PUBLIC APIs (1 endpoint)
router.use("/contact", contactRoutes);

export default router;