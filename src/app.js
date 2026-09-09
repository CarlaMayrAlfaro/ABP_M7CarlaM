import express from "express";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";
import { registrarLog } from "./utils/persistencia.js";
import { create } from "express-handlebars";
import * as path from "path";
import { fileURLToPath } from "url";
import usuariosRoutes from "./routes/usuarios.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { parseSession } from "./middlewares/auth.middleware.js";
import sequelize from "./config/database.js";
import "./models/Index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

moment.locale("es");

const app = express();

//ARCHIVOS ESTÁTICOS
// Sirve también public/uploads/pacientes/, donde quedan las fotos subidas.
app.use(express.static(path.join(__dirname, "../public")));

//CONFIGURACIÓN MOTOR PLANTILLAS
const hbs = create({
  partialsDir: [path.join(__dirname, "/views/partials")],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//MIDDLEWARES GENERALES

//REGISTRO DE PETICIONES
app.use((req, res, next) => {
  try {
    let codigo = uuidV4().slice(0, 6);
    let fechaHora = moment().format("MMMM DD [del] YYYY, hh:mm:ss a");
    let metodo = req.method;
    let ruta = req.path;
    let mensaje = `${codigo} - [${fechaHora}], Método: ${metodo}, Ruta: ${ruta}`;

    registrarLog("log_request.txt", mensaje);
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

app.use(express.json()); //guarda json en body
app.use(express.urlencoded({ extended: true })); //guarda datos enviados desde form e  body

app.use(parseSession);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

//RUTAS DE AUTENTICACIÓN
app.use("/", authRoutes);

//RUTAS DE VISTAS
app.use("/", viewsRoutes);

//RUTAS DE API
// Protegida por JWT (ver src/middlewares/jwt.middleware.js)
app.use("/api/usuarios", usuariosRoutes);

// CONEXIÓN Y SINCRONIZACIÓN CON POSTGRESQL

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Conexión a PostgreSQL establecida correctamente.");

    await sequelize.sync({ alter: true });

    console.log("✅ Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar con PostgreSQL:", error.message);
    throw error;
  }
};

export default app;
