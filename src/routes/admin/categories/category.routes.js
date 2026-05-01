import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN CATEGORY APIs (4 endpoints)
// ==========================================

// GET /api/admin/categories/list - List categories
router.get("/list", categoryController.getCategories);

// POST /api/admin/categories/create - Create category
router.post("/create", categoryController.createCategory);

// PUT /api/admin/categories/update/:id - Update category
router.put("/update/:id", categoryController.updateCategory);

// DELETE /api/admin/categories/delete/:id - Delete category
router.delete("/delete/:id", categoryController.deleteCategory);

// POST /api/admin/categories/bulk-delete
router.post("/bulk-delete", async (req, res) => {
  const { Category } = await import("../../../models/index.js");
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: 'No IDs provided' });
    const result = await Category.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} category(ies) deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;