import UserDAO from "../dao/user.dao.js";
import { createHash } from "../utils/bcrypt.js";

const userDAO = new UserDAO();

export default class UserRepository {
  async createUser(userData) {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error("No se enviaron datos del usuario");
    }

    const hashedPassword = createHash(userData.password);

    return await userDAO.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async getUserById(uid) {
    return await userDAO.getById(uid);
  }

  async updateResetToken(uid, token, expiration) {
    return await userDAO.update(uid, {
      resetToken: token,
      resetTokenExpiration: expiration,
    });
  }

  async getUserByResetToken(token) {
    return await userDAO.getByResetToken(token);
  }

  async updatePassword(uid, newPassword) {
    return await userDAO.update(uid, {
      password: newPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });
  }
}
