import { Router } from "express";
import CartManager from "../managers/cart.manager.js";
import {
  createCart,
  getCartById,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
  addProductToCartController,
} from "../controllers/cart.controller.js";

const cartManager = new CartManager();

const router = Router();

router.post("/", createCart);
router.post("/:cid/products/:pid", addProductToCartController);
router.get("/:cid", getCartById);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.delete("/:cid/products/:pid", clearCart);

router.post("/:cid/products/:pid/increase", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.updateProductQuantity(cid, pid, 1, "increase");
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al aumentar cantidad");
  }
});

router.post("/:cid/products/:pid/decrease", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.updateProductQuantity(cid, pid, 1, "decrease");
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al disminuir cantidad");
  }
});
export default router;
