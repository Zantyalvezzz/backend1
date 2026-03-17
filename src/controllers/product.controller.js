import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productRepository.getProducts({
      limit: Number(limit),
      page: Number(page),
      sort,
      query,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit);

    if (sort) queryParams.append("sort", sort);
    if (query) queryParams.append("query", query);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&${queryParams}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&${queryParams}`
        : null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener productos",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const created = await productRepository.addProduct(req.body);

    const io = req.app.get("io");
    if (io) io.emit("update-products");

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedData = req.body;

    const updatedProduct = await productRepository.updateProduct(
      pid,
      updatedData,
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const io = req.app.get("io");
    if (io) io.emit("update-products");

    res.json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productRepository.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const io = req.app.get("io");
    if (io) io.emit("update-products");

    res.json({
      status: "success",
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el producto",
    });
  }
};
