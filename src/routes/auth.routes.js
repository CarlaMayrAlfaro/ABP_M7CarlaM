import express from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/login", authController.viewLogin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
