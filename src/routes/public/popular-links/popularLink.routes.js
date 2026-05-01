import express from "express";
import PopularLink from "../../../models/PopularLink.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const links = await PopularLink.find({ isActive: true }).sort({ type: 1, order: 1 });
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
