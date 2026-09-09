import { generateToken } from "../utils/jwt.js";

const ADMIN_CREDENTIALS = {
  correo: process.env.ADMIN_EMAIL || "admin@admin.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  nombre: "Administrador",
};

const validarCredenciales = (correo, password) =>
  correo === ADMIN_CREDENTIALS.correo && password === ADMIN_CREDENTIALS.password;

export const viewLogin = (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/inicio");
  }

  res.render("login", { error: null });
};

/**
 * Login del formulario web (vistas). Mantiene el comportamiento original
 * (cookie httpOnly "admin" para proteger las vistas con authGuard) y,
 * además, genera un JWT y lo guarda en una segunda cookie NO httpOnly
 * ("token"), para que el JavaScript de las vistas (crearUsuarios,
 * actualizarUsuario, perfilUsuario) pueda leerlo y enviarlo como
 * "Authorization: Bearer <token>" al llamar a la API REST protegida
 * con JWT (ver src/middlewares/jwt.middleware.js).
 */
export const login = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.render("login", {
      error: "Por favor ingresa correo y contraseña.",
    });
  }

  if (validarCredenciales(correo, password)) {
    const token = generateToken({ correo, rol: "admin" });

    res.cookie("admin", "true", {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
    });

    // No es httpOnly a propósito: el frontend (fetch en las vistas)
    // necesita leer este valor para armar el header Authorization.
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
    });

    return res.redirect("/inicio");
  }

  res.render("login", {
    error: "Credenciales inválidas. Intenta nuevamente.",
  });
};

/**
 * Login de la API REST (JSON puro, sin cookies ni vistas).
 * Pensado para clientes externos: Postman, apps móviles, otro frontend.
 *
 * POST /api/auth/login
 * body: { "correo": "admin@admin.com", "password": "admin123" }
 */
export const apiLogin = (req, res) => {
  const { correo, password } = req.body || {};

  if (!correo || !password) {
    return res.status(400).json({
      status: "error",
      message: "Debes enviar correo y password.",
      data: null,
    });
  }

  if (!validarCredenciales(correo, password)) {
    return res.status(401).json({
      status: "error",
      message: "Credenciales inválidas.",
      data: null,
    });
  }

  const token = generateToken({ correo, rol: "admin" });

  res.json({
    status: "success",
    message: "Autenticación exitosa.",
    data: {
      token,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("admin");
  res.clearCookie("token");
  res.redirect("/");
};
