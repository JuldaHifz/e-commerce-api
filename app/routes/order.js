import { Router } from "express";
import Order from "../services/Order.js";
import { Prisma } from "@prisma/client";
import { authorizePermission } from "../middlewares.js";
import { Permission } from "../authorization.js";

const router = Router();

router.post(
  "/orders",
  authorizePermission(Permission.PLACE_ORDER),
  async (req, res) => {
    const user_id = req.user.id;

    try {
      const order = await Order.store(user_id);
      // console.log(order);
      res.json({ message: "Order created successfully", order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.get(
  "/orders",
  authorizePermission(Permission.VIEW_ORDER),
  async (req, res) => {
    const user_id = req.user.id;
    const orders = await Order.get(user_id);

    if (orders.length === 0) {
      res.status(404).json({ message: "No Orders" });
      return;
    }

    res.json(orders);
  }
);

router.get(
  "/orders/:id",
  authorizePermission(Permission.VIEW_ORDER),
  async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log(id, user_id);

    try {
      const order = await Order.getUserOrder(id, user_id);
      res.json(order);
    } catch (err) {
      res.status(404).json({ message: "Order not found" });
    }
  }
);

router.delete(
  "/orders/:id",
  authorizePermission(Permission.DELETE_ORDER),
  async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    console.log(id, user_id);
    try {
      const order = await Order.delete(id, user_id);
      res.json({ message: "Order deleted successfully", order });
    } catch (err) {
      res.status(404).json({ message: "Order not found" });
    }
  }
);

router.delete(
  "/orders",
  authorizePermission(Permission.DELETE_ORDER),
  async (req, res) => {
    const user_id = req.user.id; // Assuming req.user contains the user information from the token
    const orders = await Order.get(user_id);
    if (orders.length === 0) {
      res.status(404).json({ message: "Orders already Empty" });
      return;
    }
    await Order.empty(user_id); // Pass the user_id to the empty method
    res.json({ message: "Order emptied successfully" });
  }
);

router.post(
  "/pay/:orderId",
  authorizePermission(Permission.PLACE_ORDER),
  async (req, res) => {
    try {
      const { amount, cardNumber, cvv, expiryMonth, expiryYear } = req.body;
      const order_id = req.params.orderId;
      const user = req.user;
      const order = await Order.getUserOrder(order_id, user.id);

      if (!amount || !cardNumber || !cvv || !expiryMonth || !expiryYear) {
        throw new Error("Missing required fields for payment");
      }

      if (amount < order.total) {
        throw new Error("Not enough balance");
      }

      const payment = await fetch("http://localhost:3000/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          cardNumber,
          cvv,
          expiryMonth,
          expiryYear,
        }),
      });

      const paymentResult = await payment.json();

      res.json({
        paymentResult,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;
