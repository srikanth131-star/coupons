import express from "express";
import mongoose from "mongoose";
import Deal from "../../../models/Deal.js";
import { buildIdFilter, cleanUpdateData } from "../../../utils/idHelper.js";

const router = express.Router();

// GET /api/admin/deals - List all deals
router.get("/", async (req, res) => {
  try {
    const deals = await Deal.find().populate("store", "storeName slug logo websiteUrl").sort({ createdAt: -1 });
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/deals/create - Create deal
router.post("/create", async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.store) delete data.store;
    const deal = await Deal.create(data);
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/deals/update/:id - Update deal
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const data = cleanUpdateData(req.body);
    if (!data.store) delete data.store;
    
    let deal = await Deal.findOneAndUpdate(filter, data, { new: true });
    
    // Fallback to native driver for legacy Mixed _id data
    if (!deal) {
      const db = mongoose.connection.db;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('deals').findOneAndUpdate(
        nativeFilter, 
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      if (result) {
        console.log(`[UPDATE DEAL] Updated via native driver: ${id}`);
        return res.json({ success: true, data: result });
      }
      console.log(`[UPDATE DEAL] Deal not found with id: ${id}`);
      return res.status(404).json({ success: false, error: "Deal not found" });
    }
    
    console.log(`[UPDATE DEAL] Successfully updated: ${deal.title} (${id})`);
    res.json({ success: true, data: deal });
  } catch (error) {
    console.error(`[UPDATE DEAL] Error:`, error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/deals/delete/:id - Delete deal
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    console.log(`[DELETE DEAL] Attempting to delete deal: ${id}`);
    let deal = await Deal.findOneAndDelete(filter);
    
    // Fallback to native driver for legacy Mixed _id data
    if (!deal) {
      const db = mongoose.connection.db;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('deals').findOneAndDelete(nativeFilter);
      if (result) {
        console.log(`[DELETE DEAL] Deleted via native driver: ${id}`);
        return res.json({ success: true, message: "Deal deleted" });
      }
      console.log(`[DELETE DEAL] Deal not found: ${id}`);
      return res.status(404).json({ success: false, error: "Deal not found" });
    }
    
    console.log(`[DELETE DEAL] Successfully deleted: ${deal.title} (${id})`);
    res.json({ success: true, message: "Deal deleted" });
  } catch (error) {
    console.error(`[DELETE DEAL] Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/deals/bulk-delete - Delete multiple deals
router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, error: "No IDs provided" });
    const objectIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
    
    // Use native collection to bypass Mongoose schema casting for legacy Mixed _id data
    const db = mongoose.connection.db;
    const result = await db.collection('deals').deleteMany({
      $or: [{ _id: { $in: objectIds } }, { _id: { $in: ids } }]
    });
    
    console.log(`[BULK DELETE DEALS] Requested: ${ids.length}, Deleted: ${result.deletedCount}`);
    res.json({ success: true, message: `${result.deletedCount} deal(s) deleted` });
  } catch (error) {
    console.error(`[BULK DELETE DEALS] Error:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
