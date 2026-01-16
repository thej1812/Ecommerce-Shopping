// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,     // hairclip, earring
  tag: String,          // women, men
  type: String,         // normal, trending
  image: String
});

export default mongoose.model("Product", productSchema);
