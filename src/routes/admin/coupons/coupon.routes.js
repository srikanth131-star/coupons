import express from "express";
import mongoose from "mongoose";
import * as couponController from "../../../controllers/couponController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

router.use(trackGA4APIMiddleware);

router.get("/list", couponController.getCoupons);
router.get("/details/:id", couponController.getCouponById);
router.post("/create", couponController.createCoupon);
router.put("/update/:id", couponController.updateCoupon);
router.delete("/delete/:id", couponController.deleteCoupon);

router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: "No IDs provided" });

    // Build all possible _id representations to handle Mixed _id legacy data
    const objectIds = ids
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    // Use native collection to bypass Mongoose schema casting
    // This handles _id stored as ObjectId, string, or Mixed type
    const db = mongoose.connection.db;
    const couponCollection = db.collection('coupons');
    const couponClickCollection = db.collection('couponclicks');
    const featuredCouponCollection = db.collection('featuredcoupons');

    // Delete related data first
    const idFilter = { $or: [
      { couponId: { $in: objectIds } },
      { couponId: { $in: ids } }
    ]};
    await Promise.all([
      couponClickCollection.deleteMany(idFilter),
      featuredCouponCollection.deleteMany(idFilter),
    ]);

    // Delete coupons - match both ObjectId and string _id formats
    const result = await couponCollection.deleteMany({
      $or: [
        { _id: { $in: objectIds } },
        { _id: { $in: ids } }
      ]
    });

    console.log(`[BULK DELETE COUPONS] Requested: ${ids.length}, Deleted: ${result.deletedCount}`);
    res.json({ message: `${result.deletedCount} coupon(s) deleted` });
  } catch (error) {
    console.error(`[BULK DELETE COUPONS] Error:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
