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

// POST /api/admin/tags/bulk-delete
router.post("/bulk-delete", async (req, res) => {
  const { Tag } = await import("../../../models/index.js");
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: 'No IDs provided' });
    const result = await Tag.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} tag(s) deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
