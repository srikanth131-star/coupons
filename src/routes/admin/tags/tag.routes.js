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
  const mongoose = (await import("mongoose")).default;
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: 'No IDs provided' });
    
    const objectIds = ids
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));
    
    // Use native collection to bypass Mongoose schema casting for legacy Mixed _id data
    const db = mongoose.connection.db;
    const result = await db.collection('tags').deleteMany({
      $or: [{ _id: { $in: objectIds } }, { _id: { $in: ids } }]
    });
    
    console.log(`[BULK DELETE TAGS] Requested: ${ids.length}, Deleted: ${result.deletedCount}, IDs: ${JSON.stringify(ids.slice(0, 5))}`);
    res.json({ message: `${result.deletedCount} tag(s) deleted` });
  } catch (error) {
    console.error(`[BULK DELETE TAGS] Error:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
