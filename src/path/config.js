import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  public: path.resolve(__dirname, "../../public"),
  views: path.resolve(__dirname, "../views"),
  js: path.resolve(__dirname, "../../public/js"),
};

export default paths;
