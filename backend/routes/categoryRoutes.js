import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ADMIN: ADD CATEGORY */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const category = await Category.create({
        name: req.body.name.trim()
      });
      res.json(category);
    } catch (err) {
      res.status(400).json({ message: "Category already exists" });
    }
  }
);

// ADMIN: DELETE CATEGORY
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

/* USER + ADMIN: GET ALL CATEGORIES */
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

export default router;
