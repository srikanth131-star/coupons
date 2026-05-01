import express from "express";
import Deal from "../../../models/Deal.js";

const router = express.Router();

// GET /api/public/deals/list - Get active deals
router.get("/list", async (req, res) => {
  try {
    const { store, category, type, section, limit = 20 } = req.query;
    const query = { isActive: true };
    if (store) query.store = store;
    if (category) query.category = category;
    if (type) query.type = type;
    if (section) query.section = section;

    const deals = await Deal.find(query)
      .populate("store", "storeName slug logo websiteUrl")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/public/deals/details/:id - Get deal by ID
router.get("/details/:id", async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate("store", "storeName slug logo websiteUrl");
    if (!deal) return res.status(404).json({ success: false, error: "Deal not found" });
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
