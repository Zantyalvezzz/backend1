import express from "express";
import routes from "./routes/index.js";
import paths from "./path/config.js";
import ProductManager from "./managers/Product.Manager.js";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const pm = new ProductManager();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectandose con MongoDB:", err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.render("pages/home", {});
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render("pages/realTimeProducts", { products });
  } catch (error) {
    console.error("Error al cargar realTimeProducts:", error);
    res.status(500).send("Error al obtener productos en tiempo real");
  }
});
export default app;
