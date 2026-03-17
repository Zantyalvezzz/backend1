import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import UserDTO from "../dto/user.dto.js";
import crypto from "crypto";
import { sendRecoveryEmail } from "../utils/mailer.js";
import { generateToken } from "../utils/jwt.js";

const userRepository = new UserRepository();

export default class SessionsController {
  async register(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos obligatorios",
        });
      }

      const existingUser = await userRepository.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "El email ya está registrado",
        });
      }

      const newUser = await userRepository.createUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role: "user",
      });

      res.status(201).json({
        status: "success",
        message: "Usuario creado correctamente",
        payload: new UserDTO(newUser),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Complete email y password",
        });
      }

      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Credenciales inválidas",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Credenciales inválidas",
        });
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

      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async logout(req, res) {
    res.clearCookie("token").json({
      status: "success",
      message: "Sesión cerrada correctamente",
    });
  }

  async current(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Usuario no autenticado",
        });
      }

      const userDTO = new UserDTO(req.user);

      res.json({
        status: "success",
        payload: userDTO,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al obtener el usuario actual",
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await userRepository.getUserByEmail(email);

      if (user) {
        const token = crypto.randomBytes(32).toString("hex");

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);

        await userRepository.updateResetToken(user._id, token, expiration);

        await sendRecoveryEmail(user.email, token);
      }

      res.json({
        status: "success",
        message:
          "Si el email está registrado, recibirás un correo de recuperación.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error enviando correo de recuperación",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos",
        });
      }

      const user = await userRepository.getUserByResetToken(token);

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Token inválido",
        });
      }

      if (user.resetTokenExpiration < new Date()) {
        return res.status(400).json({
          status: "error",
          message: "El token expiró",
        });
      }

      const samePassword = await bcrypt.compare(newPassword, user.password);

      if (samePassword) {
        return res.status(400).json({
          status: "error",
          message: "La nueva contraseña no puede ser igual a la anterior",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await userRepository.updatePassword(user._id, hashedPassword);
      await userRepository.updateResetToken(user._id, null, null);

      res.json({
        status: "success",
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Error al restablecer la contraseña",
      });
    }
  }
}
