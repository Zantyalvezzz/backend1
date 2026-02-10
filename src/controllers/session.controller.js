import UserManager from "../managers/user.manager.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const userManager = new UserManager();

export default class SessionsController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Complete email y password" });
      }

      const user = await userManager.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = generateToken(user);

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 2 * 60 * 60 * 1000,
          secure: false,
        })
        .json({
          status: "success",
          message: "Usuario logueado correctamente",
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async logout(req, res) {
    res.clearCookie("token").json({
      status: "success",
      message: "Sesion cerrada correctamente",
    });
  }
}
