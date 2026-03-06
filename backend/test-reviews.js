import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "./models/Review.js";

dotenv.config();

console.log("🔍 Checking Reviews in Database...\n");

async function checkReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all reviews
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name")
      .limit(10);
    
    console.log(`📦 Found ${reviews.length} reviews\n`);
    
    if (reviews.length === 0) {
      console.log("⚠️  No reviews in database yet.\n");
      console.log("Add a review from the frontend to test!\n");
      process.exit(0);
    }

    // Check each review
    reviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log(`  ID: ${review._id}`);
      console.log(`  User: ${review.user?.name || "Unknown"}`);
      console.log(`  Product: ${review.product?.name || "Unknown"}`);
      console.log(`  Product ID: ${review.product?._id || review.product}`);
      console.log(`  Rating: ${review.rating}/5`);
      console.log(`  Description: ${review.description?.substring(0, 50)}...`);
      console.log(`  Image: ${review.reviewImage ? "✅ Yes" : "❌ No"}`);
      console.log(`  Created: ${new Date(review.createdAt).toLocaleDateString()}`);
      console.log("");
    });

    console.log("=" .repeat(50));
    console.log("\n💡 To test reviews display:");
    console.log("1. Copy a Product ID from above");
    console.log("2. Go to: http://localhost:5173/product/<PRODUCT_ID>");
    console.log("3. Scroll down to see Customer Reviews section\n");

    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkReviews();
