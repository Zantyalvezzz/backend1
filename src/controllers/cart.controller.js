import CartRepository from "../repositories/cart.repository.js";
import Ticket from "../models/ticket.model.js";
import crypto from "crypto";

const cartRepository = new CartRepository();

export const createCart = async (req, res) => {
  try {
    const cart = await cartRepository.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al crear carrito:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito",
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener carrito:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el carrito",
    });
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;

    const updatedCart = await cartRepository.addProductToCart(
      cid,
      pid,
      quantity,
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito/producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

    const updatedCart = await cartRepository.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar carrito:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error al actualizar el carrito",
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartRepository.updateProductQuantity(
      cid,
      pid,
      quantity,
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito/producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto:",
      error.message,
    );

    res.status(500).json({
      status: "error",
      message: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await cartRepository.clearCart(cid);

    if (!clearedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: clearedCart,
    });
  } catch (error) {
    console.error("Error al limpiar carrito:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error al limpiar el carrito",
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartRepository.removeProductFromCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito/producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error al eliminar el producto del carrito",
    });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartRepository.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    await cart.populate("products.product");

    const productsToPurchase = [];
    const productsNotPurchased = [];

    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      if (!product) {
        productsNotPurchased.push(item);
        continue;
      }

      if (product.status && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        productsToPurchase.push(item);
        totalAmount += product.price * item.quantity;
      } else {
        productsNotPurchased.push(item);
      }
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
      purchaser: req.user.email,
    });

    cart.products = productsNotPurchased;

    await cart.save();

    res.json({
      status: "success",
      payload: {
        ticket,
        productsNotPurchased,
      },
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error al procesar la compra",
    });
  }
};

export const increaseProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartRepository.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const product = cart.products.find(
      (p) => (p.product?._id?.toString() || p.product.toString()) === pid,
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    product.quantity += 1;

    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al aumentar cantidad:", error.message);
    res.status(500).send("Error al aumentar cantidad");
  }
};

export const decreaseProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartRepository.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const product = cart.products.find(
      (p) => (p.product?._id?.toString() || p.product.toString()) === pid,
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.products = cart.products.filter(
        (p) => (p.product?._id?.toString() || p.product.toString()) !== pid,
      );
    }

    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al disminuir cantidad:", error.message);
    res.status(500).send("Error al disminuir cantidad");
  }
};
