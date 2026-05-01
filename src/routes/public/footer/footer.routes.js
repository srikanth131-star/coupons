import express from "express";
import * as footerLinksController from "../../../controllers/footerLinksController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// PUBLIC FOOTER APIs (1 endpoint)
// ==========================================

// GET /api/public/footer/links - Get footer links
router.get("/links", footerLinksController.getFooterLinks);

export default router;