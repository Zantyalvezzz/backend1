import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", createProduct);

export default router;
