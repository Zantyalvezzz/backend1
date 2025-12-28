import CartManager from "../managers/cart.manager.js";

const cartManager = new CartManager();

export const createCart = async (req, res) => {
  try {
    const cart = await cartManager.createCart();
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
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener el carrito" });
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito/producto no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
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
    const updatedCart = await cartManager.updateCart(cid, products);
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

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito/producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto:",
      error.message
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
    const clearedCart = await cartManager.clearCart(cid);
    if (!clearedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    console.log("Carrito vaciado correctamente:", clearedCart);
    res.json({ status: "success", payload: clearedCart });
  } catch (error) {
    console.error("Error al limpiar carrito:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error al limpiar el carrito" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito/producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el producto del carrito",
    });
  }
};
