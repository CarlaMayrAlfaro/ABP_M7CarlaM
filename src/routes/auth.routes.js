import express from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = express.Router();

// --- Vistas (usan cookie de sesión) ---
router.get("/login", authController.viewLogin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// --- API REST (devuelve JWT en JSON, para clientes externos) ---
router.post("/api/auth/login", authController.apiLogin);

export default router;
