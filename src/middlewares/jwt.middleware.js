import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";

/**
 * Protege rutas de la API exigiendo un JWT válido en el header:
 *   Authorization: Bearer <token>
 *
 * A diferencia de authGuard (que redirige a /login usando la cookie de
 * sesión del navegador), este middleware es para la API REST: responde
 * siempre en JSON y nunca redirige, ya que puede ser consumido por
 * clientes externos (Postman, apps móviles, otro frontend).
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Token de autenticación no proporcionado.",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.auth = decoded; // { correo, rol, iat, exp }
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: "error",
        message: "El token expiró. Inicia sesión nuevamente.",
        data: null,
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Token inválido.",
      data: null,
    });
  }
};
