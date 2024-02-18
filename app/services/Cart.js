import { Prisma } from "@prisma/client";
import Service from "./Service.js";

class Cart extends Service {
  model = Prisma.ModelName.Cart;

  async displayCart(user_id) {
    const cartItems = await this.prisma.cart.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        product: true,
      },
    });
    return cartItems;
  }

  async addToCart(user_id, product_id, quantity) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(user_id) },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: Number(product_id) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!product) {
      throw new Error("Product not found");
    }

    const existingCart = await this.prisma.cart.findFirst({
      where: { user_id: Number(user_id), product_id: Number(product_id) },
    });

    if (existingCart) {
      const cart = await this.prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          quantity: Number(existingCart.quantity) + Number(quantity),
          total:
            Number(product.price) *
            (Number(existingCart.quantity) + Number(quantity)),
        },
      });

      return cart;
    }

    const cart = await this.prisma.cart.create({
      data: {
        user: { connect: { id: Number(user_id) } },
        product: { connect: { id: Number(product_id) } },
        quantity: Number(quantity),
        //price: Number(product.price), //Baru ditambah
        total: Number(product.price) * Number(quantity),
      },
    });

    return cart;
  }

  async delete(id, user_id) {
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: parseInt(id),
        user_id: user_id,
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const deletedCartItem = await this.prisma.cart.delete({
      where: {
        id: parseInt(id),
      },
    });

    return deletedCartItem;
  }

  async empty(user_id) {
    // Delete all carts associated with the given user ID
    return await this.prisma.cart.deleteMany({
      where: {
        user_id: Number(user_id),
      },
    });
  }
}

export default new Cart();
