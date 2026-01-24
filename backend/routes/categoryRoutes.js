import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import multer from "multer";

const router = express.Router();

/* IMAGE UPLOAD */
const storage = multer.diskStorage({
  destination: "uploads/categories/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ADD CATEGORY (ADMIN) */
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const category = new Category({
        name: req.body.name,
        image: req.file.filename
      });

      await category.save();
      res.json({ message: "Category added" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add category" });
    }
  }
);

/* GET ALL CATEGORIES */
router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

/* DELETE CATEGORY */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  }
);

export default router;
