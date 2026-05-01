import express from "express";
import publicRoutes from "./publicRoutes.js";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./auth/auth.routes.js";
import authMiddleware from "../middleware/auth.js";
import { trackGA4ErrorMiddleware } from "../middleware/ga4Analytics.js";

const router = express.Router();

// ==========================================
// UNIFIED API STRUCTURE (Admin + Public Only)
// ==========================================

// AUTH ROUTES (No auth required)
router.use("/auth", authRoutes);

// PUBLIC ROUTES (Read-only access for website visitors)
router.use("/public", publicRoutes);

// ADMIN ROUTES (Protected - requires JWT token)
router.use("/admin", authMiddleware, adminRoutes);

// ==========================================
// API DOCUMENTATION ROUTES
// ==========================================

// API Documentation and Status
router.get("/docs", (req, res) => {
  res.json({
    message: "Coupons Script Unified API Documentation",
    version: "3.0.0",
    architecture: "Unified Backend with Admin + Public APIs",
    categories: {
      public: {
        description: "Public APIs for frontend/website visitors (Read-only)",
        baseUrl: "/api/public",
        totalEndpoints: 15,
        access: "Public"
      },
      admin: {
        description: "Admin APIs with full CRUD + Backend Operations",
        baseUrl: "/api/admin", 
        totalEndpoints: 43,
        access: "Admin Only",
        includes: ["CRUD Operations", "Analytics", "System Management", "Data Processing"]
      }
    },
    totalEndpoints: 58,
    timestamp: new Date().toISOString()
  });
});

// Complete API List for Testing
router.get("/test", (req, res) => {
  res.json({
    message: "✅ Complete API List - All 58 Endpoints",
    baseUrl: "http://localhost:5000/api",
    totalAPIs: 58,
    categories: {
      public: {
        total: 15,
        endpoints: [
          { method: "GET", url: "/api/public/stores/list", description: "Get all stores" },
          { method: "GET", url: "/api/public/stores/details/:slug", description: "Get store by slug" },
          { method: "GET", url: "/api/public/coupons/list", description: "Get all coupons" },
          { method: "GET", url: "/api/public/coupons/details/:id", description: "Get coupon by ID" },
          { method: "GET", url: "/api/public/coupons/search", description: "Search coupons" },
          { method: "GET", url: "/api/public/coupons/trending", description: "Get trending coupons" },
          { method: "POST", url: "/api/public/coupons/reveal/:id", description: "Reveal coupon code" },
          { method: "POST", url: "/api/public/coupons/track-click/:id", description: "Track coupon click" },
          { method: "GET", url: "/api/public/categories/list", description: "Get all categories" },
          { method: "GET", url: "/api/public/popular-stores/list", description: "Get popular stores" },
          { method: "GET", url: "/api/public/featured-coupons/list", description: "Get featured coupons" },
          { method: "GET", url: "/api/public/site/config", description: "Get site configuration" },
          { method: "GET", url: "/api/public/site/navigation", description: "Get navigation" },
          { method: "GET", url: "/api/public/site/banners", description: "Get banners" },
          { method: "GET", url: "/api/public/footer/links", description: "Get footer links" }
        ]
      },
      admin: {
        total: 43,
        endpoints: [
          // Store Management (5)
          { method: "GET", url: "/api/admin/stores/list", description: "List all stores" },
          { method: "GET", url: "/api/admin/stores/details/:id", description: "Get store details" },
          { method: "POST", url: "/api/admin/stores/create", description: "Create store" },
          { method: "PUT", url: "/api/admin/stores/update/:id", description: "Update store" },
          { method: "DELETE", url: "/api/admin/stores/delete/:id", description: "Delete store" },
          
          // Coupon Management (5)
          { method: "GET", url: "/api/admin/coupons/list", description: "List all coupons" },
          { method: "GET", url: "/api/admin/coupons/details/:id", description: "Get coupon details" },
          { method: "POST", url: "/api/admin/coupons/create", description: "Create coupon" },
          { method: "PUT", url: "/api/admin/coupons/update/:id", description: "Update coupon" },
          { method: "DELETE", url: "/api/admin/coupons/delete/:id", description: "Delete coupon" },
          
          // Category Management (4)
          { method: "GET", url: "/api/admin/categories/list", description: "List categories" },
          { method: "POST", url: "/api/admin/categories/create", description: "Create category" },
          { method: "PUT", url: "/api/admin/categories/update/:id", description: "Update category" },
          { method: "DELETE", url: "/api/admin/categories/delete/:id", description: "Delete category" },
          
          // Popular Stores Management (4)
          { method: "GET", url: "/api/admin/popular-stores/list", description: "List popular stores" },
          { method: "POST", url: "/api/admin/popular-stores/create", description: "Create popular store" },
          { method: "PUT", url: "/api/admin/popular-stores/update/:id", description: "Update popular store" },
          { method: "DELETE", url: "/api/admin/popular-stores/delete/:id", description: "Delete popular store" },
          
          // Featured Coupons Management (4)
          { method: "GET", url: "/api/admin/featured-coupons/list", description: "List featured coupons" },
          { method: "POST", url: "/api/admin/featured-coupons/create", description: "Create featured coupon" },
          { method: "PUT", url: "/api/admin/featured-coupons/update/:id", description: "Update featured coupon" },
          { method: "DELETE", url: "/api/admin/featured-coupons/delete/:id", description: "Delete featured coupon" },
          
          // Banner Management (2)
          { method: "GET", url: "/api/admin/banner/list", description: "List banners" },
          { method: "POST", url: "/api/admin/banner/create", description: "Create banner" },
          
          // Navbar Management (2)
          { method: "GET", url: "/api/admin/navbar/navigation", description: "Get navigation" },
          { method: "PUT", url: "/api/admin/navbar/navigation/update", description: "Update navigation" },
          
          // Footer Management (4)
          { method: "GET", url: "/api/admin/footer/links/list", description: "List footer links" },
          { method: "POST", url: "/api/admin/footer/links/create", description: "Create footer link" },
          { method: "PUT", url: "/api/admin/footer/links/update/:id", description: "Update footer link" },
          { method: "DELETE", url: "/api/admin/footer/links/delete/:id", description: "Delete footer link" },
          
          // Pages Management (4)
          { method: "GET", url: "/api/admin/pages/site-config", description: "Get site config" },
          { method: "PUT", url: "/api/admin/pages/site-config/update", description: "Update site config" },
          { method: "GET", url: "/api/admin/pages/:pageName", description: "Get page" },
          { method: "PUT", url: "/api/admin/pages/:pageName/update", description: "Update page" },
          
          // Upload Management (3)
          { method: "GET", url: "/api/admin/upload/test", description: "Test upload" },
          { method: "POST", url: "/api/admin/upload/logo", description: "Upload logo" },
          { method: "DELETE", url: "/api/admin/upload/logo/delete/:filename", description: "Delete logo" },
          
          // Analytics (3)
          { method: "GET", url: "/api/admin/analytics/coupon-performance", description: "Coupon analytics" },
          { method: "GET", url: "/api/admin/analytics/store-performance", description: "Store analytics" },
          { method: "GET", url: "/api/admin/analytics/user-behavior", description: "User behavior analytics" },
          
          // Data Processing (4)
          { method: "POST", url: "/api/admin/data/bulk-import/coupons", description: "Bulk import coupons" },
          { method: "POST", url: "/api/admin/data/bulk-import/stores", description: "Bulk import stores" },
          { method: "GET", url: "/api/admin/data/export/coupons", description: "Export coupons" },
          { method: "GET", url: "/api/admin/data/export/stores", description: "Export stores" },
          
          // System Management (3)
          { method: "POST", url: "/api/admin/system/cleanup/expired-coupons", description: "Cleanup expired coupons" },
          { method: "POST", url: "/api/admin/system/optimize/database", description: "Optimize database" },
          { method: "GET", url: "/api/admin/system/logs/errors", description: "Get error logs" },
          
          // Cache Management (3)
          { method: "POST", url: "/api/admin/cache/clear/all", description: "Clear all cache" },
          { method: "POST", url: "/api/admin/cache/clear/coupons", description: "Clear coupon cache" },
          { method: "POST", url: "/api/admin/cache/clear/stores", description: "Clear store cache" },
          
          // Notifications (2)
          { method: "POST", url: "/api/admin/notifications/send/email", description: "Send email notification" },
          { method: "GET", url: "/api/admin/notifications/queue/status", description: "Get notification queue status" },
          
          // Health Check (2)
          { method: "GET", url: "/api/admin/health/database", description: "Database health check" },
          { method: "GET", url: "/api/admin/health/external-services", description: "External services health" },
          
          // Dashboard (2)
          { method: "GET", url: "/api/admin/dashboard/stats", description: "Dashboard statistics" },
          { method: "GET", url: "/api/admin/system/health", description: "System health" }
        ]
      }
    },
    testInstructions: {
      quickTest: [
        "GET http://localhost:5000/api/public/stores/list",
        "GET http://localhost:5000/api/public/coupons/list",
        "GET http://localhost:5000/api/admin/stores/list",
        "GET http://localhost:5000/api/admin/analytics/coupon-performance"
      ],
      note: "Test public APIs first (no auth needed), then admin APIs (may need auth)"
    },
    timestamp: new Date().toISOString()
  });
});

// System Status
router.get("/status", (req, res) => {
  res.json({
    status: "operational",
    message: "Coupons Script Unified API is running",
    version: "3.0.0",
    architecture: "Unified Backend",
    categories: {
      public: "✅ Operational",
      admin: "✅ Operational (Full Access)"
    },
    database: "✅ Connected",
    analytics: "✅ Tracking",
    timestamp: new Date().toISOString()
  });
});

// Add GA4 error tracking middleware
router.use(trackGA4ErrorMiddleware);

export default router;