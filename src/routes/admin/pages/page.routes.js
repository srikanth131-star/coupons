import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN PAGES APIs (4 endpoints)
// ==========================================

// GET /api/admin/pages - List pages
router.get("/", cmsController.getAllPages);

// POST /api/admin/pages/create - Create page
router.post("/create", cmsController.createPage);

// PUT /api/admin/pages/:id - Update page
router.put("/:id", cmsController.updatePageById);

// DELETE /api/admin/pages/:id - Delete page
router.delete("/:id", cmsController.deletePage);

// Legacy endpoints
// GET /api/admin/pages/site-config - Get site configuration
router.get("/site-config", cmsController.getSiteConfig);

// PUT /api/admin/pages/site-config/update - Update site configuration
router.put("/site-config/update", cmsController.updateSiteConfig);

// Analytics Configuration
// PUT /api/admin/pages/analytics/update - Update analytics configuration
router.put("/analytics/update", cmsController.updateAnalyticsConfig);

// GET /api/admin/pages/list - Get all pages (legacy)
router.get("/list", cmsController.getAllPages);

// GET /api/admin/pages/:pageName - Get page by name
router.get("/:pageName", cmsController.getPage);

// PUT /api/admin/pages/:pageName/update - Update page by name
router.put("/:pageName/update", cmsController.updatePage);

export default router;