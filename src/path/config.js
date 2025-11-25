import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
    public: path.resolve(__dirname, "../../public"),
    carts: path.resolve(__dirname, "../data/carts.json"),
    products: path.resolve(__dirname, "../data/products.json"),
    views: path.resolve(__dirname, "../views"),
    js: path.resolve(__dirname, "../../public/js"),
};

export default paths;
