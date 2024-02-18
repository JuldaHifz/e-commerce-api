import express from "express";
import productRoutes from "./app/routes/product.js";
import cartRoutes from "./app/routes/cart.js";
import orderRoutes from "./app/routes/order.js";
import registerRoutes from "./app/routes/register.js";
import loginRoutes from "./app/routes/login.js";
import { authToken } from "./app/middlewares.js";

const app = express();
app.use(express.json());

app.use(registerRoutes);
app.use(loginRoutes);

app.use(authToken);

app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

export default app;
