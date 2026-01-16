import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ================= USER SIGNUP ================= */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "user"
  });

  await user.save();
  res.json({ message: "Signup successful" });
});

/* ================= USER + ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  /* ---- ADMIN FIXED LOGIN ---- */
  if (email === "a" && password === "a") {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: "admin"
    });
  }

  /* ---- NORMAL USER LOGIN ---- */
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: "user",
    userId: user._id
  });
});

export default router;
