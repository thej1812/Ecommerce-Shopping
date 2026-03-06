import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin account already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log("\n💡 If you want to create another admin, use the API route instead.");
      process.exit(0);
    }

    // Admin credentials
    const adminData = {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Change this to a secure password
      role: "admin"
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("\n🎉 First admin account created successfully!");
    console.log("=====================================");
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log("=====================================");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("💡 You can now login with these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createFirstAdmin();
