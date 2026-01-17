import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

/* ===========================
   CREATE ORDER (USER)
=========================== */
router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    // Reduce product quantity
    for (const item of products) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { quantity: -item.qty }
      });
    }

    const order = new Order(req.body);
    await order.save();

    res.json({ message: "Order saved" });
  } catch (error) {
    res.status(500).json({ message: "Order failed" });
  }
});

/* ===========================
   GET ORDERS BY USER
=========================== */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   USER CANCEL ORDER
=========================== */
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json("Order not found");
    }

    if (order.status !== "Placed") {
      return res.status(400).json("Cannot cancel this order");
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
});

/* ===========================
   ADMIN: GET ALL ORDERS
=========================== */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
);

/* ===========================
   ADMIN: UPDATE ORDER STATUS
=========================== */
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
      });
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Status update failed" });
    }
  }
);

export default router;
