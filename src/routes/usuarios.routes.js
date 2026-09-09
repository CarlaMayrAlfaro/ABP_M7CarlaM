import express from "express";
import * as usuarioController from "../controllers/usuarios.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";
import { authenticateJWT } from "../middlewares/jwt.middleware.js";
import { uploadFoto } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Módulo 8: toda la API de usuarios exige un JWT válido (Authorization: Bearer <token>).
// Ya no depende de la cookie de sesión del navegador (esa sigue protegiendo las vistas).
router.use(authenticateJWT);

router.get("/sql", usuarioController.getUsuariosSQL);
router.get("/", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/", validateBody, usuarioController.createUsuario);
router.put("/:id", validateBody, usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

// Módulo 8: subida de la foto de perfil del paciente.
router.post("/:id/foto", uploadFoto, usuarioController.uploadFotoUsuario);

export default router;