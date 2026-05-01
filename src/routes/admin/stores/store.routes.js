import express from "express";
import * as storeController from "../../../controllers/storeController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN STORE APIs (5 endpoints)
// ==========================================

// GET /api/admin/stores/list - List all stores
router.get("/list", storeController.getStores);

// GET /api/admin/stores/details/:id - Get store details
router.get("/details/:id", storeController.getStoreById);

// POST /api/admin/stores/create - Create new store
router.post("/create", storeController.createStore);

// PUT /api/admin/stores/update/:id - Update store
router.put("/update/:id", storeController.updateStore);

// DELETE /api/admin/stores/delete/:id - Delete store
router.delete("/delete/:id", storeController.deleteStore);

// POST /api/admin/stores/bulk-delete
router.post("/bulk-delete", async (req, res) => {
  const Store = (await import("../../../models/Store.js")).default;
  const Coupon = (await import("../../../models/Coupon.js")).default;
  try {
    const { ids, deleteCoupons } = req.body;
    if (!ids?.length) return res.status(400).json({ error: 'No IDs provided' });
    let couponsDeleted = 0;
    if (deleteCoupons) {
      const couponResult = await Coupon.deleteMany({ store: { $in: ids } });
      couponsDeleted = couponResult.deletedCount;
    }
    const result = await Store.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} store(s) deleted, ${couponsDeleted} coupon(s) removed` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;