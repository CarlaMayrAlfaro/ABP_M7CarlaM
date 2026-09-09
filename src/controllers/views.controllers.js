import { Op } from "sequelize";
import moment from "moment";
import { Usuario, Historial } from "../models/Index.js";

/**
 * Página pública de bienvenida, antes del login.
 * Si ya hay sesión activa, redirige directo al dashboard (/inicio)
 * para no mostrarle la landing a alguien que ya inició sesión.
 */
export const viewLanding = async (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/inicio");
  }

  let totalPacientes = null;
  try {
    totalPacientes = await Usuario.count();
  } catch (error) {
    // La landing no debe romperse si la base de datos no responde:
    // simplemente se oculta el dato de "pacientes gestionados".
    console.error("No se pudo obtener el conteo para la landing:", error.message);
  }

  res.render("landing", { totalPacientes });
};

export const viewHome = async (req, res) => {
  try {
    const [totalPacientes, totalConFoto, totalHistorial, pacientesRecientes, actividadReciente] =
      await Promise.all([
        Usuario.count(),
        Usuario.count({ where: { foto: { [Op.ne]: null } } }),
        Historial.count(),
        Usuario.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
        Historial.findAll({
          order: [["createdAt", "DESC"]],
          limit: 5,
          include: [{ model: Usuario, as: "usuario" }],
        }),
      ]);

    const porcentajeConFoto =
      totalPacientes > 0 ? Math.round((totalConFoto / totalPacientes) * 100) : 0;

    res.render("home", {
      stats: {
        totalPacientes,
        totalConFoto,
        totalHistorial,
        porcentajeConFoto,
      },
      pacientesRecientes: pacientesRecientes.map((u) => ({
        ...u.toJSON(),
        fechaFormateada: moment(u.createdAt).format("DD MMM YYYY"),
      })),
      actividadReciente: actividadReciente.map((h) => ({
        ...h.toJSON(),
        fechaFormateada: moment(h.createdAt).fromNow(),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar página home...");
  }
};

export const viewCrearUsuarios = (req, res) => {
  try {
    res.render("crearUsuarios");
  } catch (error) {
    res.status(500).send("Error al cargar página crear usuarios...");
  }
};

export const viewUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Historial, as: "historial" }],
      order: [["createdAt", "DESC"]],
    });

    res.render("usuarios", { usuarios: usuarios.map((u) => u.toJSON()) });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar página de usuarios...");
  }
};

export const viewPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{ model: Historial, as: "historial" }],
    });
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado.");
    }

    res.render("perfilUsuario", {
      usuario: usuario ? usuario.toJSON() : null,
      id: req.params.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar página de perfil usuario.");
  }
};

export const viewActualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado.");
    }

    res.render("actualizarUsuario", { usuario: usuario.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar página de actualización.");
  }
};

export const eliminarUsuarioDesdeVista = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado.");
    }

    await usuario.destroy();
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el usuario.");
  }
};