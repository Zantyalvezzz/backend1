import CartModel from "../models/cart.model.js";

export default class CartDAO {
  async createCart() {
    return await CartModel.create({ products: [] });
  }

  async getCartById(cid, lean = false) {
    const query = CartModel.findById(cid).populate("products.product");

    if (lean) {
      return await query.lean();
    }

    return await query;
  }
  async updateCart(cid, products) {
    return await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
  }

  async save(cart) {
    return await cart.save();
  }
}
