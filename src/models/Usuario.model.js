import { v4 as uuidV4 } from "uuid";
import { leerArchivo, escribirArchivo } from "../utils/persistencia.js";

const nombreArchivo = "usuarios.json";
class Usuario {
  constructor(nombre, apellido, correo, id = uuidV4().slice(0, 8)) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.id = id;
  }

  save() {
    const data = leerArchivo(nombreArchivo);
    data.usuarios.push(this);
    escribirArchivo(nombreArchivo, data);
    return true;
  }

  update() {
    const data = leerArchivo(nombreArchivo);

    let indiceUsuario = data.usuarios.findIndex((u) => u.id == this.id);

    if (indiceUsuario == -1) {
      const error = new Error("Usuario no existe en base de datos...");
      error.code = 400;
      throw error;
    }

    data.usuarios[indiceUsuario] = this;

    escribirArchivo(nombreArchivo, data);
    return true;
  }

  //MÉTODO ESTÁTICO

  static getUsuarios() {
    const data = leerArchivo(nombreArchivo);
    return data;
  }

  static getUsuarioById(idUsuario) {
    const { usuarios } = leerArchivo(nombreArchivo);

    const usuario = usuarios.find((u) => u.id == idUsuario);

    if (!usuario) return false;

    let { nombre, apellido, correo, id } = usuario;

    return new Usuario(nombre, apellido, correo, id);
  }

  static deleteUsuario(id) {
    const data = leerArchivo(nombreArchivo);
    let indiceUsuario = data.usuarios.findIndex((u) => u.id == id);
    if (indiceUsuario == -1) {
      const error = new Error("Usuario no existe en base de datos...");
      error.code = 400;
      throw error;
    }

    data.usuarios.splice(indiceUsuario, 1);
    escribirArchivo(nombreArchivo, data);
    return true;
  }
}

export default Usuario;
