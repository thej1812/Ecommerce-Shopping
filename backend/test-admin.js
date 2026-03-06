import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const testAdminSystem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check for admin accounts
    const admins = await User.find({ role: "admin" });
    const users = await User.find({ role: "user" });

    console.log("📊 Admin System Status");
    console.log("=".repeat(50));
    console.log(`Total Admin Accounts: ${admins.length}`);
    console.log(`Total User Accounts: ${users.length}`);
    console.log("=".repeat(50));

    if (admins.length === 0) {
      console.log("\n⚠️  No admin accounts found!");
      console.log("💡 Run: node seed-admin.js to create the first admin");
    } else {
      console.log("\n👥 Admin Accounts:");
      admins.forEach((admin, index) => {
        console.log(`\n${index + 1}. ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log(`   ID: ${admin._id}`);
      });
    }

    if (users.length > 0) {
      console.log("\n\n👤 Regular User Accounts:");
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Test completed successfully");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testAdminSystem();
