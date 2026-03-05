import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload, { uploadToCloudinary, deleteFromCloudinary } from "../middleware/upload.js";

const router = express.Router();

/* ADD CATEGORY (ADMIN) */
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      let imageUrl = "";
      
      // Upload image to Cloudinary
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file, "ecommerce-categories");
      }

      const category = new Category({
        name: req.body.name,
        image: imageUrl
      });

      await category.save();
      res.json({ message: "Category added" });
    } catch (error) {
      console.error(error);
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
    try {
      const category = await Category.findById(req.params.id);
      
      // Delete image from Cloudinary
      if (category && category.image) {
        await deleteFromCloudinary(category.image);
      }
      
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  }
);

export default router;
