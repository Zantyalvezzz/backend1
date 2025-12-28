import CartModel from "../models/cart.model.js";

export default class CartManager {
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart;
  }

  async getCartById(cid, lean = false) {
    if (lean) {
      return await CartModel.findById(cid).populate("products.product").lean();
    }
    return await CartModel.findById(cid).populate("products.product");
  }


  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
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


  async updateProductQuantity(cid, pid, quantity, action = "set") {
  const cart = await CartModel.findById(cid);
  if (!cart) return null;

  const productInCart = cart.products.find((p) => p.product.toString() === pid);

  if (!productInCart) {
    if (action === "increase") {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      return null; 
    }
  } else {
    if (action === "increase") {
      productInCart.quantity += quantity;
    } else if (action === "decrease") {
      productInCart.quantity -= quantity;
      if (productInCart.quantity <= 0) {
        cart.products = cart.products.filter((p) => p.product.toString() !== pid);
      }
    } else {
      productInCart.quantity = quantity; 
    }
  }

  await cart.save();
  return cart;
}

  async decreaseProductQuantity(cid, pid) {
  const cart = await CartModel.findById(cid);
  if (!cart) return null;

  const product = cart.products.find((p) => p.product.toString() === pid);
  if (!product) return null;

  product.quantity -= 1;

  if (product.quantity <= 0) {
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  }

  await cart.save();
  return cart;
}

async increaseProductQuantity(cid, pid) {
  const cart = await CartModel.findById(cid);
  if (!cart) return null;

  const product = cart.products.find((p) => p.product.toString() === pid);
  if (product) {
    product.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  return cart;
}
}


