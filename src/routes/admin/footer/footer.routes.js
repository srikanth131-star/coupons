import express from "express";
import * as footerLinksController from "../../../controllers/footerLinksController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN FOOTER APIs (4 endpoints)
// ==========================================

// GET /api/admin/footer - List footer links
router.get("/", footerLinksController.getAllFooterLinksAdmin);

// GET /api/admin/footer/list - List footer links (alias)
router.get("/list", footerLinksController.getAllFooterLinksAdmin);
// GET /api/admin/footer/links/list - List footer links (legacy alias)
router.get("/links/list", footerLinksController.getAllFooterLinksAdmin);

// POST /api/admin/footer/create - Create footer link
router.post("/create", footerLinksController.createFooterLink);
// POST /api/admin/footer/links/create - Create footer link (legacy alias)
router.post("/links/create", footerLinksController.createFooterLink);

// PUT /api/admin/footer/:id - Update footer link
router.put("/:id", footerLinksController.updateFooterLink);

// PUT /api/admin/footer/update/:id - Update footer link (alias)
router.put("/update/:id", footerLinksController.updateFooterLink);
// PUT /api/admin/footer/links/update/:id - Update footer link (legacy alias)
router.put("/links/update/:id", footerLinksController.updateFooterLink);

// DELETE /api/admin/footer/:id - Delete footer link
router.delete("/:id", footerLinksController.deleteFooterLink);

// DELETE /api/admin/footer/delete/:id - Delete footer link (alias)
router.delete("/delete/:id", footerLinksController.deleteFooterLink);
// DELETE /api/admin/footer/links/delete/:id - Delete footer link (legacy alias)
router.delete("/links/delete/:id", footerLinksController.deleteFooterLink);

export default router;