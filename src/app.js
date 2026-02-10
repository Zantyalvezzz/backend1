import express from "express";
import routes from "./routes/index.js";
import paths from "./utils/config.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import passport from "passport";
import initializePassport from "./utils/passport.config.js";
import cookieParser from "cookie-parser";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import cartRouter from "./routes/carts.router.js";

const app = express();

dotenv.config();
initializePassport();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectandose con MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/carts", cartRouter);
app.use("/api", routes);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/public", express.static(paths.public));
app.use("/js", express.static(paths.js));

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", paths.views);
app.get("/", (req, res) => {
  res.redirect("/products");
});

export default app;
