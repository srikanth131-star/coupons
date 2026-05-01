import express from "express";
import PopularLink from "../../../models/PopularLink.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const links = await PopularLink.find().sort({ type: 1, order: 1 });
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const link = await PopularLink.create(req.body);
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const link = await PopularLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!link) return res.status(404).json({ success: false, error: "Link not found" });
    res.json({ success: true, data: link });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const link = await PopularLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ success: false, error: "Link not found" });
    res.json({ success: true, message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
