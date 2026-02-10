import User from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";

export default class UserManager {
  async createUser(userData) {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error("No se enviaron datos del usuario");
    }

    const hashedPassword = createHash(userData.password);

    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async getUserByEmail(email, lean = false) {
    if (lean) {
      return await User.findOne({ email }).lean();
    }
    return await User.findOne({ email });
  }

  async getUserById(uid, lean = false) {
    if (lean) {
      return await User.findById(uid).lean();
    }
    return await User.findById(uid);
  }
}
