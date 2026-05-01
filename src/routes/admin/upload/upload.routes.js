import express from "express";
import { upload, uploadLogo, deleteLogo } from "../../../controllers/uploadController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();
router.use(trackGA4APIMiddleware);

// POST /api/admin/upload/logo - Upload image file
router.post("/logo", upload.single("logo"), uploadLogo);

// DELETE /api/admin/upload/logo/delete/:filename
router.delete("/logo/delete/:filename", deleteLogo);

export default router;
