import express from "express";
import * as tagController from "../../../controllers/tagController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

router.use(trackGA4APIMiddleware);

// GET /api/public/tags/list
router.get("/list", tagController.getTags);

export default router;
