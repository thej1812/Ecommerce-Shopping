import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
// ADMIN: UPDATE PRODUCT QUANTITY
router.put(
  "/:id/quantity",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { quantity } = req.body;

      await Product.findByIdAndUpdate(req.params.id, {
        quantity: Number(quantity)
      });

      res.json({ message: "Quantity updated" });
    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }
  }
);
// ADMIN: DELETE PRODUCT
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

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
 
  upload.single("image"),
  async (req, res) => {
    try {
      const product = new Product({
  name: req.body.name,
  price: Number(req.body.price),
  quantity: Number(req.body.quantity),
  image: req.file.filename
});

      await product.save();
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  res.json(await Product.find());
});

export default router;
