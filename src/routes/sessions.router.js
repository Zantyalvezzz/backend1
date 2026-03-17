import { Router } from "express";
import passport from "passport";
import SessionsController from "../controllers/session.controller.js";

const router = Router();
const sessionsController = new SessionsController();

router.post("/register", sessionsController.register);

router.post("/login", sessionsController.login);

router.post("/logout", sessionsController.logout);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  sessionsController.current,
);

router.post("/forgot-password", sessionsController.forgotPassword);

router.post("/reset-password", sessionsController.resetPassword);

export default router;
