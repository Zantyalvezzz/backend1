import UserDAO from "../dao/user.dao.js";
import { createHash } from "../utils/bcrypt.js";
import CartRepository from "./cart.repository.js";

const userDAO = new UserDAO();
const cartRepository = new CartRepository();

export default class UserRepository {
  async createUser(userData) {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error("No se enviaron datos del usuario");
    }

    const hashedPassword = createHash(userData.password);

    const cart = await cartRepository.createCart();

    const user = await userDAO.create({
      ...userData,
      password: hashedPassword,
      cart: cart._id,
    });

    cart.user = user._id;
    await cartRepository.updateCart(cart._id, cart.products);

    return user;
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
