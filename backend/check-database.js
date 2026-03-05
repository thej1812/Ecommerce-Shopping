import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

console.log("🔍 Checking Database...\n");

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all products
    const products = await Product.find().limit(5);
    
    console.log(`📦 Found ${products.length} products\n`);
    
    if (products.length === 0) {
      console.log("⚠️  No products in database. Upload a product first!\n");
      process.exit(0);
    }

    // Check each product
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`  ID: ${product._id}`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Images field type: ${typeof product.images}`);
      console.log(`  Images count: ${product.images?.length || 0}`);
      
      if (product.images && product.images.length > 0) {
        console.log(`  First image: ${product.images[0]}`);
        
        // Check if it's a URL or filename
        if (product.images[0].startsWith('http')) {
          console.log(`  ✅ Image is a URL (correct!)`);
          
          // Check if it's a Cloudinary URL
          if (product.images[0].includes('cloudinary.com')) {
            console.log(`  ✅ Image is from Cloudinary (perfect!)`);
          } else {
            console.log(`  ⚠️  Image is a URL but not from Cloudinary`);
          }
        } else {
          console.log(`  ❌ Image is a filename, not a URL (PROBLEM!)`);
          console.log(`  This is why images don't display!`);
        }
      } else {
        console.log(`  ⚠️  No images in this product`);
      }
      console.log("");
    });

    console.log("=" .repeat(50));
    console.log("\n💡 Summary:");
    
    const hasUrls = products.some(p => 
      p.images && p.images.length > 0 && p.images[0].startsWith('http')
    );
    
    const hasFilenames = products.some(p => 
      p.images && p.images.length > 0 && !p.images[0].startsWith('http')
    );
    
    if (hasUrls && !hasFilenames) {
      console.log("✅ All products have Cloudinary URLs");
      console.log("   Problem is likely in frontend display");
    } else if (hasFilenames) {
      console.log("❌ Some products have filenames instead of URLs");
      console.log("   Problem: Backend not saving Cloudinary URLs");
      console.log("   Solution: Check upload middleware");
    } else {
      console.log("⚠️  No images found in any products");
      console.log("   Upload a product with images first");
    }

    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDatabase();
