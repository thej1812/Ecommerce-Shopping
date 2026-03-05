import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload, { uploadToCloudinary, deleteFromCloudinary } from "../middleware/upload.js";

const router = express.Router();

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
      console.log("=".repeat(50));
      console.log("📤 NEW PRODUCT UPLOAD REQUEST");
      console.log("=".repeat(50));
      console.log("📋 Body fields:", Object.keys(req.body));
      console.log("📁 Files received:", req.files?.length || 0);
      
      if (req.files && req.files.length > 0) {
        console.log("📸 File details:");
        req.files.forEach((file, index) => {
          console.log(`  File ${index + 1}:`, {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: `${(file.size / 1024).toFixed(2)} KB`
          });
        });
      }
      
      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          console.log(`\n🔄 Uploading: ${file.originalname}`);
          const url = await uploadToCloudinary(file, "ecommerce-products");
          console.log(`✅ Uploaded successfully!`);
          console.log(`🔗 URL: ${url}`);
          imageUrls.push(url);
        }
      } else {
        console.log("⚠️  No files to upload");
      }

      console.log("\n💾 Creating product with data:");
      console.log("  Name:", req.body.name);
      console.log("  Price:", req.body.price);
      console.log("  Quantity:", req.body.quantity);
      console.log("  Category:", req.body.category);
      console.log("  Images:", imageUrls);

      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        category: req.body.category,
        images: imageUrls
      });

      await product.save();
      
      console.log("\n✅ Product saved to MongoDB!");
      console.log("🆔 Product ID:", product._id);
      console.log("📸 Saved images:", product.images);
      console.log("=".repeat(50));
      
      res.json({ 
        message: "Product added successfully",
        product: {
          _id: product._id,
          name: product.name,
          images: product.images
        }
      });
    } catch (err) {
      console.error("\n❌ ERROR OCCURRED:");
      console.error(err);
      console.error("=".repeat(50));
      res.status(500).json({ message: "Failed to add product", error: err.message });
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
      const product = await Product.findById(req.params.id);
      
      // Delete images from Cloudinary
      if (product && product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await deleteFromCloudinary(imageUrl);
        }
      }
      
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error(error);
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
   GET LATEST 5 PRODUCTS
========================= */
router.get("/latest", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest products" });
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
    
    // Debug: Log what we're returning
    console.log("\n📦 GET PRODUCTS REQUEST");
    console.log(`  Total products: ${products.length}`);
    if (products.length > 0) {
      console.log(`  Sample product:`, {
        id: products[0]._id,
        name: products[0].name,
        images: products[0].images,
        imagesCount: products[0].images?.length || 0
      });
      
      // Check if images are URLs or filenames
      if (products[0].images && products[0].images.length > 0) {
        const firstImage = products[0].images[0];
        if (firstImage.startsWith('http')) {
          console.log("  ✅ Images are URLs (correct)");
        } else {
          console.log("  ❌ Images are filenames (wrong!)");
          console.log("  First image:", firstImage);
        }
      }
    }
    
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

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



export default router;
