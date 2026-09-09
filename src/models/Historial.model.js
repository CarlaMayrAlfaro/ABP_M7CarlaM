import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Historial extends Model {}

Historial.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    detalle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Historial",
    tableName: "historiales",
    timestamps: true,
  }
);

export default Historial;
