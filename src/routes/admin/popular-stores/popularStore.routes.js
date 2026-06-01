import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN POPULAR STORES APIs (4 endpoints)
// ==========================================

// GET /api/admin/popular-stores - List popular stores
router.get("/", categoryController.getPopularStores);

// GET /api/admin/popular-stores/list - List popular stores (alias)
router.get("/list", categoryController.getPopularStores);

// POST /api/admin/popular-stores/create - Create popular store
router.post("/create", categoryController.createPopularStore);

// PUT /api/admin/popular-stores/:id - Update popular store
router.put("/:id", categoryController.updatePopularStore);

// PUT /api/admin/popular-stores/update/:id - Update popular store (alias)
router.put("/update/:id", categoryController.updatePopularStore);

// DELETE /api/admin/popular-stores/:id - Delete popular store
router.delete("/:id", categoryController.deletePopularStore);

// DELETE /api/admin/popular-stores/delete/:id - Delete popular store (alias)
router.delete("/delete/:id", categoryController.deletePopularStore);

export default router;