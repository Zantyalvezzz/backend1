import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {
    constructor() {
        this.path = path.resolve(__dirname, "../data/products.json");
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

    async getProducts() {
        try {
            return await this._readFile();
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("Error al obtener productos");
        }
    }

    async getProductById(id) {
        try {
            const products = await this._readFile();
            return products.find(p => p.id === id) || null;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw new Error("Error al obtener el producto");
        }
    }

    async addProduct(productData) {
        try {
            const required = ["title", "description", "code", "price", "stock", "category"];
            const missing = required.filter(f => !(f in productData));
            if (missing.length) {
                throw new Error(`MISSING_FIELDS: faltan los campos: ${missing.join(", ")}`);
            }

            if (typeof productData.title !== "string") throw new Error("INVALID_TYPE: title debe ser string");
            if (typeof productData.description !== "string") throw new Error("INVALID_TYPE: description debe ser string");
            if (typeof productData.code !== "string") throw new Error("INVALID_TYPE: code debe ser string");
            if (typeof productData.price !== "number" || Number.isNaN(productData.price)) throw new Error("INVALID_TYPE: price debe ser un numero");
            if (productData.price <= 0) throw new Error("INVALID_VALUE: price no puede ser <= 0");
            if (typeof productData.stock !== "number" || !Number.isInteger(productData.stock)) throw new Error("INVALID_TYPE: stock debe ser un numero");
            if (productData.stock < 0) throw new Error("INVALID_VALUE: stock no puede ser negativo");
            if (typeof productData.category !== "string") throw new Error("INVALID_TYPE: category debe ser string");

            if ("status" in productData && typeof productData.status !== "boolean") {
                throw new Error("INVALID_TYPE: status debe ser boolean");
            }

            if ("thumbnails" in productData) {
                if (!Array.isArray(productData.thumbnails) || !productData.thumbnails.every(t => typeof t === "string")) {
                    throw new Error("INVALID_TYPE: thumbnails debe ser array de strings");
                }
            }

            const products = await this._readFile();

            const codeExists = products.some(p => p.code === productData.code);
            if (codeExists) {
                throw new Error(`DUPLICATE_CODE: product con code '${productData.code}' ya existe`);
            }

            const newProduct = {
                id: uuidv4(),
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: productData.price,
                status: ("status" in productData) ? productData.status : true,
                stock: productData.stock,
                category: productData.category,
                thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
            };

            products.push(newProduct);
            await this._writeFile(products);

            return newProduct;

        } catch (err) {
            console.error("Error al agregar producto:", err);
            throw err;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this._readFile();
            const index = products.findIndex(p => p.id === id);

            if (index === -1) {
                throw new Error(`PRODUCT_NOT_FOUND: No existe producto con id '${id}'`);
            }

            if ("id" in updatedFields) {
                delete updatedFields.id;
            }

            if (Object.keys(updatedFields).length === 0) {
                throw new Error("NO_FIELDS_PROVIDED: No se enviaron campos para actualizar");
            }

            products[index] = { ...products[index], ...updatedFields };

            await this._writeFile(products);
            return products[index];

        } catch (err) {
            console.error("Error al actualizar producto:", err.message);
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this._readFile();
            const filtered = products.filter(p => p.id !== id);

            if (filtered.length === products.length) {
                throw new Error(`NOT_FOUND: No se encontró un producto con id '${id}'`);
            }

            await this._writeFile(filtered);

            return { success: true, message: `Producto con id '${id}' eliminado correctamente` };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw new Error("Error al eliminar producto");
        }
    }
}
