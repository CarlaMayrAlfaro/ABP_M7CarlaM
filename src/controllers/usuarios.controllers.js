import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { Usuario, Historial } from "../models/Index.js";

const usuarioResponse = (usuario) => usuario.toJSON();

export const getUsuarios = async (req, res) => {
  try {
    const { nombre } = req.query;

    const where = nombre
      ? {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${nombre}%` } },
            { apellido: { [Op.iLike]: `%${nombre}%` } },
          ],
        }
      : {};

    const usuarios = await Usuario.findAll({
      where,
      include: [{ model: Historial, as: "historial" }],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: "success",
      message: "Usuarios obtenidos correctamente.",
      data: usuarios.map(usuarioResponse),
      cantidad: usuarios.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al intentar obtener los datos de usuarios.",
      data: null,
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{ model: Historial, as: "historial" }],
    });

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
        data: null,
      });
    }

    res.json({
      status: "success",
      message: "Usuario obtenido correctamente.",
      data: usuarioResponse(usuario),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al intentar obtener el usuario.",
      data: null,
    });
  }
};

export const createUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { nombre, apellido, correo, observaciones } = req.body;

    if (!nombre || !apellido || !correo) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
        data: null,
      });
    }

    const usuario = await Usuario.create(
      { nombre, apellido, correo, observaciones },
      { transaction }
    );

    await Historial.create(
      {
        usuarioId: usuario.id,
        accion: "CREACIÓN",
        detalle: `Paciente ${usuario.nombre} ${usuario.apellido} registrado.`,
      },
      { transaction }
    );

    await transaction.commit();

    const usuarioCreado = await Usuario.findByPk(usuario.id, {
      include: [{ model: Historial, as: "historial" }],
    });

    res.status(201).json({
      status: "success",
      message: "Paciente creado correctamente.",
      data: usuarioResponse(usuarioCreado),
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "Ya existe un paciente registrado con ese correo.",
        data: null,
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors.map((e) => e.message).join(" "),
        data: null,
      });
    }

    res.status(500).json({
      status: "error",
      message: "No fue posible crear el paciente. Se realizó rollback.",
      data: null,
    });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
        data: null,
      });
    }

   const { nombre, apellido, correo, observaciones } = req.body;
 
    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      correo: correo || usuario.correo,
      observaciones: observaciones !== undefined ? observaciones : usuario.observaciones,
    });

    await Historial.create({
      usuarioId: usuario.id,
      accion: "ACTUALIZACIÓN",
      detalle: "Datos del paciente actualizados.",
    });

    const actualizado = await Usuario.findByPk(usuario.id, {
      include: [{ model: Historial, as: "historial" }],
    });

    res.json({
      status: "success",
      message: "Usuario actualizado correctamente.",
      data: usuarioResponse(actualizado),
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "error",
        message: "El correo ya está registrado.",
        data: null,
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors.map((e) => e.message).join(" "),
        data: null,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Error al intentar actualizar el usuario.",
      data: null,
    });
  }
};

export const deleteUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const usuario = await Usuario.findByPk(req.params.id, { transaction });

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
        data: null,
      });
    }

    await Historial.create(
      {
        usuarioId: usuario.id,
        accion: "ELIMINACIÓN",
        detalle: `Se eliminó al paciente ${usuario.nombre} ${usuario.apellido}.`,
      },
      { transaction }
    );

    await usuario.destroy({ transaction });
    await transaction.commit();

    res.json({
      status: "success",
      message: "Usuario eliminado correctamente.",
      data: null,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Error al eliminar el usuario. Se realizó rollback.",
      data: null,
    });
  }
};

// Consulta SQL manual para demostrar la comparación SQL vs ORM solicitada en M7.
export const getUsuariosSQL = async (req, res) => {
  try {
    const [usuarios] = await sequelize.query(`
      SELECT id, nombre, apellido, correo, "createdAt"
      FROM usuarios
      ORDER BY "createdAt" DESC;
    `);

    res.json({
      status: "success",
      message: "Usuarios obtenidos mediante SQL manual.",
      data: usuarios,
      cantidad: usuarios.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al ejecutar la consulta SQL.",
      data: null,
    });
  }
};