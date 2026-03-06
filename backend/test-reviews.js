import dotenv from "dotenv";
import mongoose from "mongoose";
import Review from "./models/Review.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

const testReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all reviews
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    console.log("📊 Review System Status");
    console.log("=".repeat(60));
    console.log(`Total Reviews: ${reviews.length}`);
    console.log("=".repeat(60));

    if (reviews.length === 0) {
      console.log("\n⚠️  No reviews found in database");
      console.log("💡 Reviews will appear after customers submit them");
    } else {
      console.log("\n📝 All Reviews:\n");
      
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. Review ID: ${review._id}`);
        console.log(`   Product: ${review.product?.name || "Unknown"}`);
        console.log(`   User: ${review.user?.name || "Unknown"} (${review.user?.email || "N/A"})`);
        console.log(`   Rating: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating}/5)`);
        console.log(`   Description: ${review.description.substring(0, 80)}${review.description.length > 80 ? "..." : ""}`);
        console.log(`   Image: ${review.reviewImage ? "✅ Yes" : "❌ No"}`);
        if (review.reviewImage) {
          console.log(`   Image URL: ${review.reviewImage}`);
        }
        console.log(`   Created: ${review.createdAt}`);
        console.log(`   Updated: ${review.updatedAt}`);
        console.log("");
      });

      // Group by product
      const reviewsByProduct = {};
      reviews.forEach(review => {
        const productId = review.product?._id?.toString() || "unknown";
        if (!reviewsByProduct[productId]) {
          reviewsByProduct[productId] = {
            productName: review.product?.name || "Unknown",
            count: 0,
            avgRating: 0,
            ratings: []
          };
        }
        reviewsByProduct[productId].count++;
        reviewsByProduct[productId].ratings.push(review.rating);
      });

      console.log("=".repeat(60));
      console.log("📈 Reviews by Product:\n");
      
      Object.entries(reviewsByProduct).forEach(([productId, data]) => {
        const avgRating = (data.ratings.reduce((a, b) => a + b, 0) / data.count).toFixed(1);
        console.log(`Product: ${data.productName}`);
        console.log(`  Total Reviews: ${data.count}`);
        console.log(`  Average Rating: ${avgRating}/5 ${"★".repeat(Math.round(avgRating))}`);
        console.log("");
      });
    }

    console.log("=".repeat(60));
    console.log("✅ Test completed successfully");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testReviews();
