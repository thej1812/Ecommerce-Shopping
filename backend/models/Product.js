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
  },
  
    images: {
      type: [String], // array of image filenames
      default: []
    },

  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category"
},
description: {
  type: String,
  default: ""
},


});

export default mongoose.model("Product", productSchema);
