import Usuario from "./Usuario.model.js";
import Historial from "./Historial.model.js";

Usuario.hasMany(Historial, {
  foreignKey: "usuarioId",
  as: "historial",
  onDelete: "CASCADE",
});

Historial.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

export { Usuario, Historial };