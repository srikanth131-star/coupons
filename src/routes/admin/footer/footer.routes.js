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

// POST /api/admin/footer/create - Create footer link
router.post("/create", footerLinksController.createFooterLink);

// PUT /api/admin/footer/:id - Update footer link
router.put("/:id", footerLinksController.updateFooterLink);

// DELETE /api/admin/footer/:id - Delete footer link
router.delete("/:id", footerLinksController.deleteFooterLink);

export default router;