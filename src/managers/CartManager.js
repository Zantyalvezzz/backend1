import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CartManager {
    constructor() {
        this.path = path.resolve(__dirname, "../data/carts.json");
    }

    async _readFile() {
        try {
            const content = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(content);
        } catch (err) {
            if (err.code === "ENOENT") {
                await fs.promises.writeFile(this.path, "[]");
                return [];
            }
            throw err;
        }
    }

    async _writeFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error al escribir el archivo:", error);
            throw new Error("Error al guardar los datos");
        }
    }

    async getCarts() {
        try {
            return await this._readFile();
        } catch (error) {
            console.error("Error al obtener carritos:", error);
            throw new Error("Error al obtener carritos");
        }
    }

    async createCart() {
        try {
            const carts = await this._readFile();
            const newCart = {
                id: uuidv4(),
                products: []
            };
            carts.push(newCart);
            await this._writeFile(carts);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(id) {
        try {
            const carts = await this._readFile();
            return carts.find(c => c.id === id) || null;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw new Error("Error al obtener el carrito");
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this._readFile();
            const cart = carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error("CART_NOT_FOUND");
            }

            const existingProduct = cart.products.find(p => p.product === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await this._writeFile(carts);
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }
}