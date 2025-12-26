import Product from "../models/product.model.js";

export default class ProductManager {
  async getProducts({ page = 1, limit = 10, sort, query }) {
    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    return await Product.paginate(filter, options);
  }

  async getProductById(pid) {
    const product = await Product.findById(pid);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async addProduct(productData) {
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error("No se enviaron datos del producto");
    }
    return await Product.create(productData);
  }

  async updateProduct(pid, updatedFields) {
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }

    const updated = await Product.findByIdAndUpdate(pid, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new Error("Producto no encontrado para actualizar");
    }

    return updated;
  }

  async deleteProduct(pid) {
    const deleted = await Product.findByIdAndDelete(pid);
    if (!deleted) {
      throw new Error("Producto no encontrado para eliminar");
    }
    return { success: true };
  }
}
