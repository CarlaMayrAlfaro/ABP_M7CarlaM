import Usuario from "../models/Usuario.model.js";

export const viewHome = (req, res) => {
    try {

        res.render("home");
        
    } catch (error) {
        res.status(500).send("Error al cargar página home...");
    }
}

export const viewCrearUsuarios = (req, res) => {
    try {

        res.render("crearUsuarios");
        
    } catch (error) {
        res.status(500).send("Error al cargar página crear usuarios...");
    }

}


export const viewUsuarios = (req, res) => {
    try {

        let { usuarios }  = Usuario.getUsuarios();
        res.render("usuarios", {
            usuarios
        });
        
    } catch (error) {
        res.status(500).send("Error al cargar página de usuarios...");
    }

}


export const viewPerfilUsuario = (req, res) => {
    try {

        let { id } = req.params;

        const usuario = Usuario.getUsuarioById(id);

        res.render("perfilUsuario", {
            usuario,
            id
        });
        
    } catch (error) {
        res.status(500).send("Error al cargar página de perfil usuario.");
    }
}