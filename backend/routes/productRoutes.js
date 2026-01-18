import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import multer from "multer";

const router = express.Router();

/* =========================
   MULTER CONFIG (MULTIPLE IMAGES)
========================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* =========================
   ADMIN: ADD PRODUCT (4 IMAGES MAX)
========================= */
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 4),
  async (req, res) => {
    try {
      const images = req.files ? req.files.map(f => f.filename) : [];

      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        category: req.body.category,
        images
      });

      await product.save();
      res.json({ message: "Product added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add product" });
    }
  }
);

/* =========================
   ADMIN: UPDATE PRODUCT QUANTITY
========================= */
router.put(
  "/:id/quantity",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        quantity: Number(req.body.quantity)
      });

      res.json({ message: "Quantity updated" });
    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

/* =========================
   ADMIN: DELETE PRODUCT
========================= */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  }
);
/* =========================
   ADMIN: UPDATE PRODUCT IMAGES
   (DELETE / REORDER)
========================= */
router.put(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { images } = req.body; // updated image array

      await Product.findByIdAndUpdate(req.params.id, {
        images
      });

      res.json({ message: "Images updated" });
    } catch (error) {
      res.status(500).json({ message: "Image update failed" });
    }
  }
);
/* =========================
   GET SINGLE PRODUCT
========================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

/* =========================
   USER + ADMIN: GET PRODUCTS
   (CATEGORY FILTER SUPPORTED)
========================= */
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category && req.query.category !== "undefined") {
      filter.category = req.query.category;
    }

    if (req.query.exclude) {
      filter._id = { $ne: req.query.exclude };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


export default router;
