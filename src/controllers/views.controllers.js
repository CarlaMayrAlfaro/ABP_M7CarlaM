import { Usuario, Historial } from "../models/Index.js";

export const viewHome = (req, res) => {
  try {
    res.render("home");
  } catch (error) {
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
