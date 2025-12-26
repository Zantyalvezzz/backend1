import CartModel from "../models/cart.model.js";

export default class CartManager {
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart;
  }

  async getCartById(cid) {
    return await CartModel.findById(cid).populate("products.product");
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }

  async updateCart(cid, products) {
    return await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const product = cart.products.find((p) => p.product.toString() === pid);

    if (!product) return null;

    product.quantity = quantity;
    await cart.save();
    return cart;
  }
}
