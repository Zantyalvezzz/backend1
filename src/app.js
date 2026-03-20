import "./utils/env.js";
import "./utils/cron.js";
import express from "express";
import routes from "./routes/index.js";
import paths from "./utils/config.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import passport from "passport";
import initializePassport from "./utils/passport.config.js";
import cookieParser from "cookie-parser";
import { create } from "express-handlebars";
import { authenticate } from "./middlewares/authenticate.js";
import methodOverride from "method-override";
import cartRouter from "./routes/carts.router.js";
import cors from "cors";
import MongoSingleton from "./utils/mongoSingleton.js";
import session from "express-session";

const app = express();

initializePassport();

MongoSingleton.getInstance();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticate);
app.use(passport.initialize());
app.use(express.static("public"));
app.use(
  session({
    name: "sid",
    secret: "mi_clave_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
      secure: false,
    },
  }),
);

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartRouter);
app.use("/api", routes);

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
