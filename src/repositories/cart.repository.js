import mongoose from "mongoose";
import CartDAO from "../dao/cart.dao.js";

const cartDAO = new CartDAO();

export default class CartRepository {
  async createCart() {
    return await cartDAO.createCart();
  }

  async getCartById(cid, lean = false) {
    return await cartDAO.getCartById(cid, lean);
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    const productId = new mongoose.Types.ObjectId(pid);

    const productIndex = cart.products.findIndex(
      (p) =>
        p.product?._id?.toString() === pid || p.product?.toString() === pid,
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cartDAO.save(cart);
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await cartDAO.getCartById(cid);
    if (!cart) return null;

    const productId = pid.toString();

    const product = cart.products.find((p) => {
      const productIdStr = p.product?._id?.toString() || p.product?.toString();
      return productIdStr === productId;
    });

    if (!product) {
      console.log("Product not found in cart");
      return null;
    }

    product.quantity = quantity;
    return await cartDAO.save(cart);
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
}
