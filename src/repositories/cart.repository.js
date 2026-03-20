import mongoose from "mongoose";
import CartDAO from "../dao/cart.dao.js";

const cartDAO = new CartDAO();

export default class CartRepository {
  async createCart(userId = null) {
    const cart = await cartDAO.createCart();
    if (userId) {
      cart.user = new mongoose.Types.ObjectId(userId);
      await cartDAO.save(cart);
    }
    return cart;
  }

  async getCartById(cid, lean = false) {
    return await cartDAO.getCartById(cid, lean);
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    const productIdStr = pid.toString();

    const productIndex = cart.products.findIndex((p) => {
      const currentId = p.product._id
        ? p.product._id.toString()
        : p.product.toString();

      return currentId === productIdStr;
    });

    if (productIndex !== -1) {
      const currentQty = Number(cart.products[productIndex].quantity) || 0;
      cart.products[productIndex].quantity = currentQty + Number(quantity);
    } else {
      cart.products.push({
        product: new mongoose.Types.ObjectId(pid),
        quantity: Number(quantity),
      });
    }

    return await cartDAO.save(cart);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    if (!cart) return null;

    const item = cart.products.find((p) => {
      const currentId = p.product._id
        ? p.product._id.toString()
        : p.product.toString();

      return currentId === productId.toString();
    });

    if (!item) return null;

    if (quantity <= 0) {
      cart.products = cart.products.filter((p) => {
        const currentId = p.product._id
          ? p.product._id.toString()
          : p.product.toString();

        return currentId !== productId.toString();
      });
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    return this.getCartById(cartId, true);
  }

  async removeProductFromCart(cid, pid) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (p) =>
        p.product?._id?.toString() !== pid && p.product?.toString() !== pid,
    );

    return await cartDAO.save(cart);
  }

  async clearCart(cid) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    cart.products = [];
    return await cartDAO.save(cart);
  }

  async updateCart(cid, products) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    const formattedProducts = products.map((p) => ({
      product: new mongoose.Types.ObjectId(p.product),
      quantity: p.quantity,
    }));

    cart.products = formattedProducts;
    return await cartDAO.save(cart);
  }

  async mergeCarts(sessionCartId, userCartId) {
    const sessionCart = await cartDAO.getCartById(sessionCartId);
    const userCart = await cartDAO.getCartById(userCartId);

    if (!sessionCart || !userCart) return;

    for (const item of sessionCart.products) {
      const itemId = item.product?._id?.toString() || item.product.toString();

      const existing = userCart.products.find((p) => {
        const pId = p.product?._id?.toString() || p.product.toString();
        return pId === itemId;
      });

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        userCart.products.push({
          product: item.product._id || item.product,
          quantity: item.quantity,
        });
      }
    }

    await cartDAO.save(userCart);

    await cartDAO.deleteCartById(sessionCartId);
  }
}
