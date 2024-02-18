import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import Product from "../services/Product.js";
import { authToken, authorizePermission } from "../middlewares.js";
import { Permission } from "../authorization.js";

const prisma = new PrismaClient();
const router = Router();

router.get(
  "/products",
  authorizePermission(Permission.BROWSE_PRODUCTS),
  async (req, res) => {
    let products;
    const searchQuery = req.query;
    console.log("search query", searchQuery);
    if (searchQuery) {
      products = await Product.search(searchQuery);
    } else {
      products = await Product.get();
    }
    if (products.length === 0) {
      res.status(404).json({ message: "Products not found" });
      return;
    }
    // const products = await Product.get();
    res.json(products);
  }
);

router.get(
  "/products/:id",
  authorizePermission(Permission.VIEW_PRODUCT),
  async (req, res) => {
    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await Product.find(productId);
      res.json(product);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.post(
  "/products",
  authorizePermission(Permission.ADD_PRODUCT),
  async (req, res) => {
    const { name, category, price, in_stock, description } = req.body;

    if (!name || !category || !price || !in_stock) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const product = await prisma.product.create({
      data: { name, category, price, in_stock, description },
    });

    res.json({ message: "Product created successfully", product });
  }
);

router.put(
  "/products/:id",
  authorizePermission(Permission.EDIT_PRODUCT),
  async (req, res) => {
    const { name, category, price, in_stock, description } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.update({
        where: { id: Number(productId) }, // !!!!!!!!!
        data: { name, category, price, in_stock, description },
      });
      res.json({ message: "Product updated successfully", product });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.delete(
  "/products/:id",
  authorizePermission(Permission.DELETE_PRODUCT),
  async (req, res) => {
    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.delete({
        where: { id: Number(productId) },
      });
      res.json({ message: "Product deleted successfully", product });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

export default router;
