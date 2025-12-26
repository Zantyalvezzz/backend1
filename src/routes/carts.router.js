import { Router } from "express";
import {
  createCart,
  getCartById,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.delete("/:cid", clearCart);

export default router;
