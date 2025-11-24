// Minuto 49 de la clase habla sobre multer y la subida de archivos en caso de no tener bien la configuracion de multer
//  (no se pide para la segunda entrega)


import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage : storage });

export default upload;