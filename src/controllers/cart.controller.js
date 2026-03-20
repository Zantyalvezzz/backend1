import CartRepository from "../repositories/cart.repository.js";
import Ticket from "../models/ticket.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const cartRepository = new CartRepository();

const getCartId = (req) => {
  if (req.user && req.user.cart) {
    return req.user.cart.toString();
  }

  if (req.session && req.session.cartId) {
    return req.session.cartId;
  }
  return null;
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartRepository.createCart();
    if (!req.user) req.session.cartId = cart._id.toString();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al crear carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al crear el carrito" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const cart = await cartRepository.getCartById(cid, true);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener el carrito" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid) {
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });
    }

    const products = req.body;
    const updatedCart = await cartRepository.updateCart(cid, products);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error al actualizar carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el carrito" });
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const { pid } = req.params;

    let quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    const updatedCart = await cartRepository.addProductToCart(
      cid,
      pid,
      quantity,
    );

    if (!updatedCart)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const { pid } = req.params;
    let { quantity } = req.body;
    quantity = parseInt(quantity);

    if (isNaN(quantity) || quantity === 0)
      return res
        .status(400)
        .json({ status: "error", message: "Cantidad inválida" });

    const updatedCart = await cartRepository.updateProductQuantity(
      cid,
      pid,
      quantity,
      true,
    );

    if (!updatedCart)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: updatedCart });
  } catch (err) {
    console.error("Error al actualizar cantidad:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar cantidad" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const { pid } = req.params;
    const updatedCart = await cartRepository.removeProductFromCart(cid, pid);
    if (!updatedCart)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto del carrito",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const clearedCart = await cartRepository.clearCart(cid);
    if (!clearedCart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: clearedCart });
  } catch (error) {
    console.error("Error al limpiar carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al limpiar el carrito" });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const cid = getCartId(req);
    if (!cid)
      return res
        .status(400)
        .json({ status: "error", message: "Carrito no definido" });

    const cart = await cartRepository.getCartById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    await cart.populate("products.product");

    const productsToPurchase = [];
    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      if (!product || !product.status || product.stock < item.quantity) {
        productsNotPurchased.push(item);
        continue;
      }
      product.stock -= item.quantity;
      await product.save();

      productsToPurchase.push(item);
      totalAmount += product.price * item.quantity;
    }

    if (productsToPurchase.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No hay productos con stock suficiente",
      });
    }

    const code = crypto.randomBytes(6).toString("hex");
    const ticket = await Ticket.create({
      code: `TICKET-${code}`,
      amount: totalAmount,
      purchaser: req.user ? req.user.email : "Invitado",
    });

    cart.products = productsNotPurchased;
    await cart.save();

    res.json({ status: "success", payload: { ticket, productsNotPurchased } });
  } catch (error) {
    console.error("Error al procesar la compra:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al procesar la compra" });
  }
};
