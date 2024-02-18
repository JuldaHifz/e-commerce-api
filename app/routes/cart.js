import { Router } from "express";
import Cart from "../services/Cart.js";
import { validateAddToCart } from "../validators.js";
import { authorizePermission } from "../middlewares.js";
import { Permission } from "../authorization.js";

const router = Router();

router.get(
  "/cart",
  authorizePermission(Permission.VIEW_CART),
  async (req, res) => {
    const user_id = req.user.id;

    const cart = await Cart.displayCart(user_id);
    if (cart.length === 0) {
      res.status(404).json({ message: "No product in cart" });
      return;
    }
    res.json(cart);
  }
);

router.post(
  "/cart",
  [validateAddToCart, authorizePermission(Permission.ADD_TO_CART)],
  async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    //   if (!product_id || !quantity) {
    //     res.status(400).json({ message: "Missing required fields" });
    //     return;
    //   }
    try {
      const cart = await Cart.addToCart(user_id, product_id, quantity);

      res.json({ message: "Cart created successfully", cart });
    } catch (err) {
      res.status(404).json({ message: "Product not found" });
    }
  }
);

router.delete(
  "/cart/:id",
  authorizePermission(Permission.REMOVE_FROM_CART),
  async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
      const cart = await Cart.delete(id, user_id);
      res.json({ message: "Product in Cart deleted successfully", cart });
    } catch (err) {
      res.status(404).json({ message: "Cart item not found" });
    }
  }
);

router.delete(
  "/cart",
  authorizePermission(Permission.EMPTY_CART),
  async (req, res) => {
    const user_id = req.user.id; // Assuming req.user contains the user information from the token
    const cart = await Cart.displayCart(user_id);
    if (cart.length === 0) {
      res.status(404).json({ message: "No product in cart" });
      return;
    }

    await Cart.empty(user_id); // Pass the user_id to the empty method
    res.json({ message: "Cart emptied successfully" });
  }
);

export default router;
