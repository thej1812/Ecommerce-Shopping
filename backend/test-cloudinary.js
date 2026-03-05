import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("🔧 Testing Cloudinary Configuration...\n");

console.log("📋 Configuration:");
console.log("  Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("  API Key:", process.env.CLOUDINARY_API_KEY);
console.log("  API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");
console.log("");

// Test connection by fetching account details
async function testConnection() {
  try {
    console.log("🔄 Testing connection to Cloudinary...");
    
    // Try to get usage stats (this will verify credentials)
    const result = await cloudinary.api.usage();
    
    console.log("✅ Connection successful!");
    console.log("\n📊 Account Info:");
    console.log("  Plan:", result.plan || "Free");
    console.log("  Credits used:", result.credits?.used || 0);
    console.log("  Credits limit:", result.credits?.limit || "N/A");
    console.log("  Storage used:", result.storage?.used || 0, "bytes");
    console.log("\n✅ Cloudinary is configured correctly!");
    
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Error:", error.message);
    
    if (error.http_code === 401) {
      console.error("\n⚠️  Authentication failed. Please check:");
      console.error("  1. CLOUDINARY_CLOUD_NAME is correct");
      console.error("  2. CLOUDINARY_API_KEY is correct");
      console.error("  3. CLOUDINARY_API_SECRET is correct");
    }
  }
}

testConnection();
