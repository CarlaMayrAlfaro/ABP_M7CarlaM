import express from 'express';
import * as usuarioController from '../controllers/usuarios.controllers.js';
import { validateBody } from '../middlewares/validate_body.js';

const router = express.Router();

//OBTENER TODOS LOS USUARIOS
router.get("/", usuarioController.getUsuarios);

//OBTENER USUARIO POR ID
router.get("/:id", usuarioController.getUsuarioById);

//CREAR NUEVO USUARIO
router.post("/", validateBody, usuarioController.createUsuario);

//ACTUALIZAR USUARIO
router.put("/:id", validateBody, usuarioController.updateUsuario);

//ELIMINAR USUARIO
router.delete("/:id", usuarioController.deleteUsuario);

export default router;
