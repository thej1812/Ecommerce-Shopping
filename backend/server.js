// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ✅ ADD THIS */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ✅ KEEP THIS */
app.use(express.json());

/* ✅ ROUTES */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

/* ✅ IMAGE ACCESS */
app.use("/uploads", express.static("uploads"));

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
