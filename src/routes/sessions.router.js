import { Router } from "express";
import passport from "passport";
import SessionsController from "../controllers/session.controller.js";
import UserManager from "../managers/user.manager.js";
import bcrypt from "bcrypt";

const router = Router();
const sessionsController = new SessionsController();
const userManager = new UserManager();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const existingUser = await userManager.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const newUser = await userManager.createUser({
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
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/login", (req, res) => sessionsController.login(req, res));

router.post("/logout", (req, res) => sessionsController.logout(req, res));

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, first_name, last_name, email, age, role } = req.user;

    res.json({
      status: "success",
      user: {
        id: _id,
        first_name,
        last_name,
        email,
        age,
        role,
      },
    });
  },
);

export default router;
