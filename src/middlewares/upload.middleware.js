import multer from "multer";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidV4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carpeta pública donde se guardan las fotos de pacientes
const UPLOAD_DIR = path.join(__dirname, "..", "..", "public", "uploads", "pacientes");

// La crea si no existe (por ejemplo, en un checkout limpio del repo)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MIME_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO_MB = 2;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `${uuidV4()}${extension}`;
    cb(null, nombreUnico);
  },
});

const fileFilter = (req, file, cb) => {
  if (!MIME_PERMITIDOS.includes(file.mimetype)) {
    return cb(
      new Error(
        `Tipo de archivo no permitido (${file.mimetype}). Solo se aceptan JPG, PNG o WEBP.`
      )
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: TAMANO_MAXIMO_MB * 1024 * 1024 },
});

/**
 * Middleware listo para usar en las rutas: envuelve multer.single("foto")
 * y traduce sus errores (tipo de archivo no permitido, tamaño excedido,
 * etc.) al formato de respuesta consistente { status, message, data }
 * que usa el resto de la API, en vez de dejar que Express los propague
 * como una página de error HTML.
 */
export const uploadFoto = (req, res, next) => {
  upload.single("foto")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const mensajes = {
        LIMIT_FILE_SIZE: `El archivo supera el tamaño máximo permitido (${TAMANO_MAXIMO_MB}MB).`,
      };
      return res.status(400).json({
        status: "error",
        message: mensajes[err.code] || err.message,
        data: null,
      });
    }

    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
        data: null,
      });
    }

    next();
  });
};

export { UPLOAD_DIR };
