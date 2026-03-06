import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/upload.js";

const router = express.Router();

/* =========================
   ADD REVIEW (ONLY IF DELIVERED)
========================= */
router.post(
  "/:productId/:orderId",
  authMiddleware,
  upload.single("reviewImage"),
  async (req, res) => {
    try {
      const { productId, orderId } = req.params;
      const { rating, description } = req.body;

      // Check if order exists and belongs to user
      const order = await Order.findOne({
        _id: orderId,
        userId: req.user.id
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      // Check if order is delivered
      if (order.status !== "Delivered") {
        return res.status(403).json({
          message: "You can only review delivered products"
        });
      }

      // Check if product is in the order
      const productInOrder = order.products.find(
        p => p._id?.toString() === productId || p.productId?.toString() === productId
      );

      if (!productInOrder) {
        return res.status(403).json({
          message: "Product not found in this order"
        });
      }

      // Check if user already reviewed this product for this order
      const existingReview = await Review.findOne({
        user: req.user.id,
        product: productId,
        order: orderId
      });

      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this product for this order"
        });
      }

      // Upload image to Cloudinary if provided
      let reviewImageUrl = null;
      if (req.file) {
        reviewImageUrl = await uploadToCloudinary(req.file, "ecommerce-reviews");
      }

      // Create review
      const review = new Review({
        user: req.user.id,
        product: productId,
        order: orderId,
        rating: Number(rating),
        description,
        reviewImage: reviewImageUrl
      });

      await review.save();
      
      res.json({ 
        message: "Review added successfully",
        review
      });
    } catch (error) {
      console.error("Add review error:", error);
      
      // Handle duplicate review error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "You have already reviewed this product for this order"
        });
      }
      
      res.status(500).json({ message: "Failed to add review" });
    }
  }
);

/* =========================
   GET REVIEWS FOR PRODUCT
========================= */
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId
    })
    .populate("user", "name")
    .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

/* =========================
   CHECK IF USER CAN REVIEW
========================= */
router.get("/can-review/:productId/:orderId", authMiddleware, async (req, res) => {
  try {
    const { productId, orderId } = req.params;

    // Check if order exists and is delivered
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
      status: "Delivered"
    });

    if (!order) {
      return res.json({ canReview: false, reason: "Order not delivered" });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.json({ canReview: false, reason: "Already reviewed" });
    }

    res.json({ canReview: true });
  } catch (error) {
    console.error("Check review error:", error);
    res.status(500).json({ message: "Failed to check review status" });
  }
});

export default router;
