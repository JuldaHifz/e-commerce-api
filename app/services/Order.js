import { Prisma } from "@prisma/client";
import Service from "./Service.js";
import Cart from "./Cart.js";

class Order extends Service {
  model = Prisma.ModelName.Order;

  async store(user_id) {
    const cart = await Cart.displayCart(user_id);
    // console.log(cart);
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    // console.log("cart", cart);
    const total = cart.reduce((acc, currItem) => acc + currItem.total, 0);

    return this.prisma.$transaction(async (transaction) => {
      const order = await transaction.order.create({
        data: {
          user: { connect: { id: user_id } },
          date: new Date(),
          number: `ORD/${Math.floor(Math.random() * 1000)}`,
          total: total,
        },
      });

      await transaction.orderItem.createMany({
        data: cart.map((product) => {
          // console.log(product);
          return {
            order_id: order.id,
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.product.price,
            total: product.total,
          };
        }),
      });

      await Cart.empty(user_id);
    });
  }

  async get(user_id) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { user_id: Number(user_id) },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });
      return orders;
    } catch (err) {
      throw new Error("Failed to retrieve orders");
    }
  }

  async getUserOrder(id, user_id) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });
      // console.log("order", order);
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.user_id !== user_id) {
        throw new Error("Unauthorized (Order is for another user)");
      }

      return order;
    } catch (err) {
      throw new Error(err.message || "Failed to retrieve orders");
    }
  }

  async find(id) {
    try {
      return await this.prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (err) {
      throw new Error("Not found");
    }
  }

  async delete(id, user_id) {
    try {
      // Retrieve the order before deleting it
      const order = await this.prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          order_items: true, // Optionally include related order items
        },
      });
      console.log("delete order", order);
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.user_id !== user_id) {
        throw new Error("Unauthorized, Wrong User");
      }

      // Delete related order items
      await this.prisma.orderItem.deleteMany({
        where: { order_id: Number(id) },
      });

      // Delete the order
      await this.prisma.order.delete({
        where: { id: Number(id) },
      });

      return order; // Optionally, return the deleted order
    } catch (err) {
      throw new Error("Failed to delete order");
    }
  }

  async empty(user_id) {
    try {
      await this.prisma.$transaction(async (transaction) => {
        // Find all orders associated with the given user ID
        const orders = await transaction.order.findMany({
          where: { user_id: Number(user_id) },
          select: { id: true }, // Only select the order IDs
        });

        // Extract order IDs from the retrieved orders
        const orderIds = orders.map((order) => order.id);

        // Delete order items associated with the retrieved order IDs
        await transaction.orderItem.deleteMany({
          where: {
            order_id: { in: orderIds }, // Delete order items with order IDs in the extracted list
          },
        });

        // Delete the orders themselves
        await transaction.order.deleteMany({
          where: {
            user_id: Number(user_id),
          },
        });
      });
    } catch (err) {
      throw new Error("Failed to empty orders");
    }
  }
}

export default new Order();
