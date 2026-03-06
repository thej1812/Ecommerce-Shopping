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

const changeAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get admin email
    const email = await question("Enter admin email: ");
    
    // Find admin
    const admin = await User.findOne({ email, role: "admin" });
    
    if (!admin) {
      console.log("\n❌ Admin account not found with that email");
      process.exit(1);
    }

    console.log(`\n✅ Found admin: ${admin.name}`);
    
    // Get new password
    const newPassword = await question("Enter new password (min 8 characters): ");
    
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

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log("\n🎉 Password changed successfully!");
    console.log(`✅ Admin: ${admin.name} (${admin.email})`);
    console.log("\n💡 You can now login with the new password");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    rl.close();
    process.exit(1);
  }
};

changeAdminPassword();
