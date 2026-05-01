import express from "express";
import * as tagController from "../../../controllers/tagController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

router.use(trackGA4APIMiddleware);

// GET /api/admin/tags/list
router.get("/list", tagController.getTags);

// POST /api/admin/tags/create
router.post("/create", tagController.createTag);

// PUT /api/admin/tags/update/:id
router.put("/update/:id", tagController.updateTag);

// DELETE /api/admin/tags/delete/:id
router.delete("/delete/:id", tagController.deleteTag);

export default router;
