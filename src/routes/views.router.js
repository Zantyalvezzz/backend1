import { Router } from "express";
import { ensureCart } from "../middlewares/ensureCart.js";
import ProductRepository from "../repositories/product.repository.js";
import CartRepository from "../repositories/cart.repository.js";

const router = Router();

const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

const getCartId = (req) => {
  if (req.user?.cart) return req.user.cart.toString();
  return req.session.cartId;
};

router.get("/products", ensureCart, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    const result = await productRepository.getProducts({
      page,
      limit,
      sort,
      lean: true,
    });

    res.render("pages/index", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      cartId: getCartId(req),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", ensureCart, async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("pages/productDetail", {
      product: product.toObject(),
      cartId: getCartId(req),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts", ensureCart, async (req, res) => {
  try {
    const cid = getCartId(req);

    const cart = await cartRepository.getCartById(cid, true);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("pages/cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.get("/forgot-password", (req, res) => {
  res.render("pages/forgotPassword");
});

router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token inválido");
  }

  res.render("pages/resetPassword", { token });
});

export default router;
