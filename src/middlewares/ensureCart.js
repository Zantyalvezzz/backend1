import CartRepository from "../repositories/cart.repository.js";

const cartRepository = new CartRepository();

export const ensureCart = async (req, res, next) => {
  try {
    if (req.user && req.user.cart) {
      return next();
    }
    if (!req.session.cartId) {
      const tempCart = await cartRepository.createCart();
      req.session.cartId = tempCart._id.toString();
    }

    next();
  } catch (error) {
    console.error("Error en ensureCart:", error);
    res.status(500).send("Error interno");
  }
};
