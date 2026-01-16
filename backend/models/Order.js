import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userName: String,
  phone: String,
  address: String,

  products: Array,

  totalAmount: Number,

  status: {
    type: String,
    enum: ["Placed", "Shipped", "Delivered","Cancelled"],
    default: "Placed"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);
