import Usuario from '../models/Usuario.model.js';

export const getUsuarios = (req, res) => {
    try {
        let { usuarios } = Usuario.getUsuarios();

        res.json({usuarios, cantidad: usuarios.length});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error al intentar obtener los datos de usuarios..."});
    }
}

export const getUsuarioById = (req, res) => {
    try {

        let { id } = req.params;

        const usuario = Usuario.getUsuarioById(id);

        if(!usuario) return res.status(404).json({message: "Usuario no encontrado."});


        res.json({ usuario });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error al intentar obtener el usuario, intente más tarde."});
    }
}

export const createUsuario = (req, res) => {
    try {

        let {nombre, apellido, correo } = req.body;

        if(!nombre || !apellido || !correo){
            return res.status(400).json({message: "Todos los campos son obligatorios."});
        }


        const usuario = new Usuario(nombre, apellido, correo);

        usuario.save();

        res.status(201).json({message: "Usuario creado correctamente", usuario});
                
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error al intentar crear el usuario."});
    }
}


export const updateUsuario = (req, res) => {
    try {

        let { id } = req.params;
        let {nombre, apellido, correo } = req.body;

        const usuario = Usuario.getUsuarioById(id);

        if(!usuario) return res.status(404).json({message: "Usuario no encontrado."});

        usuario.nombre = nombre || usuario.nombre;
        usuario.apellido = apellido || usuario.apellido;
        usuario.correo = correo || usuario.correo;

        usuario.update();

        res.status(201).json({message: "Usuario actualizado correctamente", usuario});
                
    } catch (error) {
        console.log(error);
        if(error.code){
            return res.status(error.code).json({message: error.message});
        }
        res.status(500).json({message: "Error al intentar actualizar el usuario."});
    }
}


export const deleteUsuario = (req, res) => {
    try {

        let { id } = req.params;

        Usuario.deleteUsuario(id);

        res.status(201).json({message: "Usuario eliminado correctamente"});
                
    } catch (error) {
        console.log(error);
        if(error.code){
            return res.status(error.code).json({message: error.message});
        }
        res.status(500).json({message: "Error al intentar eliminar el usuario."});
    }
}