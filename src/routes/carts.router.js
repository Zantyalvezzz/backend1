import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);

    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart.products);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener carritos" });
    }

});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartManager.getCartById(cartId);
        const product = await productManager.getProductById(productId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await cartManager.addProductToCart(cartId, productId);
        const updatedCart = await cartManager.getCartById(cartId);
        res.status(201).json(updatedCart);

    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

export default router;
