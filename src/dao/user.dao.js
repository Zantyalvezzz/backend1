import User from "../models/user.model.js";

export default class UserDAO {
  async create(userData) {
    return await User.create(userData);
  }

  async getByEmail(email, lean = false) {
    if (lean) {
      return await User.findOne({ email }).lean();
    }

    return await User.findOne({ email });
  }

  async getById(uid, lean = false) {
    if (lean) {
      return await User.findById(uid).lean();
    }

    return await User.findById(uid);
  }

  async update(uid, updateData) {
    return await User.findByIdAndUpdate(uid, updateData, { new: true });
  }

  async getByResetToken(token) {
    return await User.findOne({ resetToken: token });
  }
}
