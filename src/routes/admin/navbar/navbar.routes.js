import express from "express";
import * as cmsController from "../../../controllers/cmsController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN NAVBAR APIs (4 endpoints)
// ==========================================

// GET /api/admin/navbar - List navbar items
router.get("/", cmsController.getNavbarItems);

// GET /api/admin/navbar/list - List navbar items (alias)
router.get("/list", cmsController.getNavbarItems);

// POST /api/admin/navbar/create - Create navbar item
router.post("/create", cmsController.createNavbarItem);

// PUT /api/admin/navbar/:id - Update navbar item
router.put("/:id", cmsController.updateNavbarItem);

// PUT /api/admin/navbar/update/:id - Update navbar item (alias)
router.put("/update/:id", cmsController.updateNavbarItem);

// DELETE /api/admin/navbar/:id - Delete navbar item
router.delete("/:id", cmsController.deleteNavbarItem);

// DELETE /api/admin/navbar/delete/:id - Delete navbar item (alias)
router.delete("/delete/:id", cmsController.deleteNavbarItem);

// Legacy navigation endpoints
// GET /api/admin/navbar/navigation - Get navigation
router.get("/navigation", cmsController.getNavigation);

// PUT /api/admin/navbar/navigation/update - Update navigation
router.put("/navigation/update", cmsController.updateNavigation);

export default router;