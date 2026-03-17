import Product from "../models/product.model.js";

export default class ProductDAO {
  async paginate(filter, options) {
    return await Product.paginate(filter, options);
  }

  async getById(pid, lean = false) {
    if (lean) return await Product.findById(pid).lean();
    return await Product.findById(pid);
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(pid, updatedFields) {
    return await Product.findByIdAndUpdate(pid, updatedFields, {
      new: true,
      runValidators: true,
    });
  }

  async delete(pid) {
    return await Product.findByIdAndDelete(pid);
  }
}
