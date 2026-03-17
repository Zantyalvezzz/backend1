import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  createProduct,
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  updateProduct,
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  deleteProduct,
);

export default router;
