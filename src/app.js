import express from "express";
import routes from "./routes/index.js";
import paths from "./path/config.js";
import { create } from "express-handlebars";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use("/public", express.static(paths.public));

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

app.get("/realtimeproducts", (req, res) => {
    res.render("pages/realTimeProducts");
});

export default app;