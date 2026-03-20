import { Router } from "express";
import { ensureCart } from "../middlewares/ensureCart.js";
import CartRepository from "../repositories/cart.repository.js";
import {
  createCart,
  getCartById,
  updateCart,
  deleteProductFromCart,
  clearCart,
  addProductToCartController,
  purchaseCart,
  updateProductQuantity,
} from "../controllers/cart.controller.js";

const router = Router();
const cartRepository = new CartRepository();

router.post("/", createCart);

router.post("/products/:pid", ensureCart, addProductToCartController);

router.put("/products/:pid", ensureCart, updateProductQuantity);

router.post("/purchase", ensureCart, purchaseCart);

router.get("/", ensureCart, getCartById);

router.put("/", ensureCart, updateCart);

router.delete("/products/:pid", ensureCart, deleteProductFromCart);

router.delete("/", ensureCart, clearCart);

export default router;
