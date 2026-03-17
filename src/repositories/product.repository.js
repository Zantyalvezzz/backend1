import ProductDAO from "../dao/product.dao.js";

const productDAO = new ProductDAO();

export default class ProductRepository {
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

    return await productDAO.paginate(filter, options);
  }

  async getProductById(pid) {
    return await productDAO.getById(pid);
  }

  async addProduct(productData) {
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error("No se enviaron datos del producto");
    }

    return await productDAO.create(productData);
  }

  async updateProduct(pid, updatedFields) {
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }

    const updated = await productDAO.update(pid, updatedFields);

    if (!updated) {
      throw new Error("Producto no encontrado para actualizar");
    }

    return updated;
  }

  async deleteProduct(pid) {
    const deleted = await productDAO.delete(pid);

    if (!deleted) {
      throw new Error("Producto no encontrado para eliminar");
    }

    return { success: true };
  }
}
