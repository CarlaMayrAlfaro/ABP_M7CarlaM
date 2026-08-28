import express from "express";
import * as usuarioController from "../controllers/usuarios.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authGuard);

router.get("/sql", usuarioController.getUsuariosSQL);
router.get("/", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/", validateBody, usuarioController.createUsuario);
router.put("/:id", validateBody, usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

export default router;
