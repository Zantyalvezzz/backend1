import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import CartManager from "../managers/cart.manager.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    const result = await productManager.getProducts({
      page,
      limit,
      sort,
      lean: true, 
    });

    const cartId = "694e397e486edb5ca8172694";

    res.render("pages/index", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      cartId,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    
    const product = await productManager.getProductById(pid, true); 

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    const cartId = "694e397e486edb5ca8172694";

    res.render("pages/productDetail", {
      product,
      cartId,
    });
  } catch (error) {
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

   
    const cart = await cartManager.getCartById(cid, true);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("pages/cart", { cart });
  } catch (error) {
    res.status(500).send("Error al cargar el carrito");
  }
});

router.delete("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.clearCart(cid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send("Error al vaciar el carrito");
  }
});

router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductFromCart(cid, pid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send("Error al eliminar producto del carrito");
  }
});

export default router;
