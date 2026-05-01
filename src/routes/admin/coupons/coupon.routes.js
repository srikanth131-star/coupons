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

    const Coupon = mongoose.model("Coupon");
    const CouponClick = mongoose.model("CouponClick");
    const FeaturedCoupon = mongoose.model("FeaturedCoupon");

    await Promise.all([
      CouponClick.deleteMany({ couponId: { $in: ids } }),
      FeaturedCoupon.deleteMany({ couponId: { $in: ids } }),
    ]);
    const result = await Coupon.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} coupon(s) deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
