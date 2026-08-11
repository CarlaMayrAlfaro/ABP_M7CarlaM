import express from "express";
import * as viewsController from "../controllers/views.controllers.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

//OBTENER TODOS LOS USUARIOS
router.get("/", authGuard, viewsController.viewHome);

//VISTA CREAR USUARIOS
router.get("/crear-usuarios", authGuard, viewsController.viewCrearUsuarios);

//VISTA MOSTRAR TODOS LOS USUARIOS
router.get("/usuarios", authGuard, viewsController.viewUsuarios);

//VISTA PERFIL USUARIO
router.get(
  "/usuarios/perfil/:id",
  authGuard,
  viewsController.viewPerfilUsuario,
);

export default router;
