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

      console.log("Adding review:", { productId, orderId, userId: req.user.id });

      // Validate input
      if (!rating || !description) {
        return res.status(400).json({
          message: "Rating and description are required"
        });
      }

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
        console.log("Uploading review image to Cloudinary...");
        reviewImageUrl = await uploadToCloudinary(req.file, "ecommerce-reviews");
        console.log("Review image uploaded:", reviewImageUrl);
      }

      // Create review
      const review = new Review({
        user: req.user.id,
        product: productId,
        order: orderId,
        rating: Number(rating),
        description: description.trim(),
        reviewImage: reviewImageUrl
      });

      await review.save();
      console.log("Review saved successfully:", review._id);
      
      res.json({ 
        message: "Review added successfully",
        review: {
          _id: review._id,
          rating: review.rating,
          description: review.description,
          reviewImage: review.reviewImage,
          createdAt: review.createdAt
        }
      });
    } catch (error) {
      console.error("Add review error:", error);
      
      // Handle duplicate review error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "You have already reviewed this product for this order"
        });
      }
      
      res.status(500).json({ 
        message: "Failed to add review",
        error: error.message 
      });
    }
  }
);

/* =========================
   GET REVIEWS FOR PRODUCT
========================= */
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log("Fetching reviews for product:", productId);

    const reviews = await Review.find({
      product: productId
    })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance

    console.log(`Found ${reviews.length} reviews for product ${productId}`);

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ 
      message: "Failed to fetch reviews",
      error: error.message 
    });
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
    res.status(500).json({ 
      message: "Failed to check review status",
      error: error.message 
    });
  }
});

export default router;
