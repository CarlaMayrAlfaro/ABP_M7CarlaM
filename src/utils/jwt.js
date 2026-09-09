import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_no_usar_en_produccion";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

/**
 * Genera un JWT firmado a partir de un payload (correo y rol del admin).
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica un JWT. Lanza jwt.TokenExpiredError o jwt.JsonWebTokenError
 * según corresponda, para que el middleware pueda distinguir ambos casos.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
