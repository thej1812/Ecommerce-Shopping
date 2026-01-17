import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  tag: String,
  type: String, // normal / trending
  image: String,

  quantity: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Product", productSchema);
