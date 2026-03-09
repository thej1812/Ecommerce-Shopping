import mongoose from "mongoose";

/**
 * Review Schema for product reviews
 * @description Stores customer reviews with ratings, descriptions, and optional images
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    reviewImage: {
      type: String, // Cloudinary secure_url
      default: null
    }
  },
  { 
    timestamps: true // Creates createdAt and updatedAt automatically
  }
);

// Ensure one review per user per product per order
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

// Index for faster product review queries
reviewSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
