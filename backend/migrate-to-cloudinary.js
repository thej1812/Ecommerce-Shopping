import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import cloudinary from "./config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log("🔄 Migrating existing products to Cloudinary...\n");

async function migrateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all products with filename-based images
    const products = await Product.find();
    
    console.log(`📦 Found ${products.length} products\n`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      console.log(`\nProcessing: ${product.name}`);
      
      if (!product.images || product.images.length === 0) {
        console.log("  ⏭️  No images, skipping");
        skippedCount++;
        continue;
      }

      // Check if already migrated (has URLs)
      if (product.images[0].startsWith('http')) {
        console.log("  ✅ Already has URLs, skipping");
        skippedCount++;
        continue;
      }

      // Migrate filenames to Cloudinary
      const newImageUrls = [];
      
      for (const filename of product.images) {
        try {
          // Check if file exists locally
          const filePath = path.join(__dirname, 'uploads', filename);
          
          if (!fs.existsSync(filePath)) {
            console.log(`  ⚠️  File not found: ${filename}`);
            continue;
          }

          console.log(`  📤 Uploading: ${filename}`);
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "ecommerce-products",
            public_id: filename.split('.')[0],
            resource_type: "auto"
          });

          console.log(`  ✅ Uploaded: ${result.secure_url}`);
          newImageUrls.push(result.secure_url);
          
        } catch (uploadError) {
          console.error(`  ❌ Upload failed for ${filename}:`, uploadError.message);
        }
      }

      // Update product if we got any URLs
      if (newImageUrls.length > 0) {
        product.images = newImageUrls;
        await product.save();
        console.log(`  💾 Updated product with ${newImageUrls.length} images`);
        migratedCount++;
      } else {
        console.log(`  ❌ No images could be uploaded`);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n📊 Migration Summary:");
    console.log(`  ✅ Migrated: ${migratedCount} products`);
    console.log(`  ⏭️  Skipped: ${skippedCount} products`);
    console.log(`  ❌ Errors: ${errorCount} products`);
    
    if (migratedCount > 0) {
      console.log("\n✅ Migration complete! Images now use Cloudinary URLs.");
      console.log("   Check your frontend - images should display now!");
    } else if (skippedCount > 0) {
      console.log("\n⚠️  All products already migrated or no local files found.");
      console.log("   If images still don't display, delete products and re-upload.");
    }

    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Migration error:", error.message);
    process.exit(1);
  }
}

migrateProducts();
