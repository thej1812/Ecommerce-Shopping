import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Show all admins
    const admins = await User.find({ role: "admin" });
    
    if (admins.length === 0) {
      console.log("❌ No admin accounts found");
      console.log("💡 Run: npm run seed-admin to create first admin");
      process.exit(1);
    }

    console.log("📋 Current Admin Accounts:");
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.email})`);
    });

    // Get current admin email
    const currentEmail = await question("\nEnter current admin email to update: ");
    
    // Find admin
    const admin = await User.findOne({ email: currentEmail, role: "admin" });
    
    if (!admin) {
      console.log("\n❌ Admin account not found with that email");
      process.exit(1);
    }

    console.log(`\n✅ Found admin: ${admin.name} (${admin.email})`);
    console.log("\n📝 Leave blank to keep current value\n");

    // Get new name
    const newName = await question(`New name [${admin.name}]: `);
    if (newName.trim()) {
      admin.name = newName.trim();
    }

    // Get new email
    const newEmail = await question(`New email [${admin.email}]: `);
    if (newEmail.trim()) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        console.log("\n❌ Invalid email format");
        process.exit(1);
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== admin._id.toString()) {
        console.log("\n❌ Email already in use by another account");
        process.exit(1);
      }

      admin.email = newEmail.toLowerCase().trim();
    }

    // Get new password
    const newPassword = await question("New password (min 8 characters, leave blank to keep current): ");
    
    if (newPassword.trim()) {
      if (newPassword.length < 8) {
        console.log("\n❌ Password must be at least 8 characters");
        process.exit(1);
      }

      // Confirm password
      const confirmPassword = await question("Confirm new password: ");
      
      if (newPassword !== confirmPassword) {
        console.log("\n❌ Passwords do not match");
        process.exit(1);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }

    // Save changes
    await admin.save();

    console.log("\n🎉 Admin account updated successfully!");
    console.log("=====================================");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    if (newPassword.trim()) {
      console.log(`Password: Updated`);
    } else {
      console.log(`Password: Unchanged`);
    }
    console.log("=====================================");
    console.log("\n💡 You can now login with the updated credentials");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    rl.close();
    process.exit(1);
  }
};

updateAdmin();
