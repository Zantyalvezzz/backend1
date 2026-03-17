import { Router } from "express";
import {
  createCart,
  getCartById,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
  addProductToCartController,
  purchaseCart,
  increaseProductQuantity,
  decreaseProductQuantity,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", createCart);

router.post("/:cid/products/:pid", addProductToCartController);

router.post("/:cid/products/:pid/increase", increaseProductQuantity);

router.post("/:cid/products/:pid/decrease", decreaseProductQuantity);

router.post("/:cid/purchase", purchaseCart);

router.get("/:cid", getCartById);

router.put("/:cid", updateCart);

router.put("/:cid/products/:pid", updateProductQuantity);

router.delete("/:cid/products/:pid", deleteProductFromCart);

router.delete("/:cid", clearCart);

export default router;
