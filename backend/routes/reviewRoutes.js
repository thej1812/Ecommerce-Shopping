import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/upload.js";

const router = express.Router();

/* =========================
   ADD REVIEW (ONLY IF ORDERED)
========================= */
router.post(
  "/:productId",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const hasOrdered = await Order.findOne({
        userId: req.user.id,
        "items.product": req.params.productId
      });

      if (!hasOrdered) {
        return res.status(403).json({
          message: "Only buyers can review this product"
        });
      }

      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files?.images) {
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file, "ecommerce-reviews");
          imageUrls.push(url);
        }
      }

      // Upload video to Cloudinary
      let videoUrl = null;
      if (req.files?.video && req.files.video[0]) {
        videoUrl = await uploadToCloudinary(req.files.video[0], "ecommerce-reviews");
      }

      const review = new Review({
        user: req.user.id,
        product: req.params.productId,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        images: imageUrls,
        video: videoUrl
      });

      await review.save();
      res.json({ message: "Review added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add review" });
    }
  }
);

/* =========================
   GET REVIEWS FOR PRODUCT
========================= */
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId
    }).populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

export default router;
