import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
 
  upload.single("image"),
  async (req, res) => {
    try {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.file ? req.file.filename : ""
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
