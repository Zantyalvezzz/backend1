import ProductManager from "../managers/product.manager.js";

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productManager.getProducts({
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
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const created = await productManager.addProduct(req.body);

    const io = req.app.get("io");
    io.emit("update-products");

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
