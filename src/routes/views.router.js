import { Router } from "express";
import ProductRepository from "../repositories/product.repository.js";
import CartRepository from "../repositories/cart.repository.js";

const router = Router();

const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

const CART_ID = "69b9daa7dd4df2ff38a3a47f";

router.get("/products", async (req, res) => {
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
      cartId: CART_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("pages/productDetail", {
      product: product.toObject(),
      cartId: CART_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartRepository.getCartById(cid, true);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("pages/cart", {
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

router.delete("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    await cartRepository.clearCart(cid);

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al vaciar el carrito");
  }
});

router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    await cartRepository.deleteProductFromCart(cid, pid);

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar producto del carrito");
  }
});

router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token inválido o faltante");
  }

  res.render("pages/resetPassword", { token });
});

export default router;
