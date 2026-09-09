import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Usuario extends Model {}

Usuario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio." },
      },
    },
    apellido: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido es obligatorio." },
      },
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Debe ingresar un correo válido." },
      },
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Módulo 8: ruta relativa a la foto de perfil del paciente.
    // El archivo binario vive en public/uploads/pacientes/; aquí solo
    // se persiste la referencia (ej: "/uploads/pacientes/<uuid>.jpg").
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;
