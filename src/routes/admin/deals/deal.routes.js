import express from "express";
import Deal from "../../../models/Deal.js";

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
    const data = { ...req.body };
    if (!data.store) delete data.store;
    const deal = await Deal.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!deal) return res.status(404).json({ success: false, error: "Deal not found" });
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/deals/delete/:id - Delete deal
router.delete("/delete/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ success: false, error: "Deal not found" });
    res.json({ success: true, message: "Deal deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/deals/bulk-delete - Delete multiple deals
router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, error: "No IDs provided" });
    const result = await Deal.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} deal(s) deleted` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
