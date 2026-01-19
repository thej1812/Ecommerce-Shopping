import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,

    description: {
      type: String,
      default: "",
    },

    price: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    tag: String,

    type: String, // normal / trending

    image: String,

    quantity: {
      type: Number,
      default: 0,
    },

    images: {
      type: [String], // array of image filenames
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
