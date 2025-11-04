import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);

    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const created = await productManager.addProduct(newProduct);
        res.status(201).json(created);

    } catch (error) {
        console.error("Error al crear producto:", error.message);

        if (error.message.startsWith("MISSING_FIELDS")) {
            return res.status(400).json({ error: "Faltan campos obligatorios." });
        }

        if (error.message.startsWith("INVALID_") || error.message.startsWith("DUPLICATE_")) {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const updatedFields = req.body;

        if ("id" in updatedFields) {
            return res.status(400).json({ error: "No se puede modificar el ID del producto" });
        }

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
        }

        const updatedProduct = await productManager.updateProduct(id, updatedFields);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({
            message: "Producto actualizado correctamente",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const deleted = await productManager.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
