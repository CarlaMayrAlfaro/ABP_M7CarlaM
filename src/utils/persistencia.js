import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const leerArchivo = (nombreArchivo) => {
    let ruta = path.join(__dirname, "..", "data", nombreArchivo);
    
    if(!fs.existsSync(ruta)){
        throw new Error(`Nombre de archivo: ${nombreArchivo} no existe...`);
    }

    let data = fs.readFileSync(ruta, "utf-8");

    return JSON.parse(data);
}

export const escribirArchivo = (nombreArchivo, data) => {
    let ruta = path.join(__dirname, "..", "data", nombreArchivo);

    if(!fs.existsSync(ruta)){
        throw new Error(`Nombre de archivo: ${nombreArchivo} no existe...`);
    }

    data = JSON.stringify(data, null, 4);

    fs.writeFileSync(ruta, data, "utf-8");
    return true;
}


export const registrarLog = (nombreArchivo, data) => {
    console.log(data);
    return true;
}
