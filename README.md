# MediGest — ABP Módulos 6, 7 y 8

Aplicación Express + Handlebars + PostgreSQL (Sequelize) para gestión de pacientes. Incluye vistas protegidas por sesión de administrador y una **API RESTful protegida con JWT**, con subida de la foto de perfil del paciente.

## Resumen por módulo

- **Módulo 6**: estructura del servidor, rutas/controladores/middlewares,
  vistas Handlebars, login de administrador por cookie, logging a archivo
  plano.
- **Módulo 7**: persistencia real en PostgreSQL vía Sequelize, modelos
  `Usuario` y `Historial` relacionados 1:N, CRUD completo, transacciones,
  búsqueda filtrada (`?nombre=`), consulta SQL manual de comparación.
- **Módulo 8** *(esta entrega)*:
  - API REST protegida con **JSON Web Tokens**.
  - **Subida de archivos**: foto de perfil del paciente, con `multer`.
  - Respuestas de la API con formato consistente `{ status, message, data }`.

## Requisitos

- Node.js v18+
- PostgreSQL corriendo localmente (o accesible por red)
- npm

## Instalación

```bash
npm install
```

Copia `.env` (o `.env.example` si prefieres no versionarlo) y ajusta tus
credenciales de PostgreSQL. Ya incluye valores por defecto para desarrollo:

```env
DB_NAME=ABP_M7_CarlaM
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=localhost
DB_PORT=5432

ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123

JWT_SECRET=medigest_super_secreto_cambiar_en_produccion
JWT_EXPIRES_IN=2h
```

## Ejecución

```bash
node server.js --puerto 3000
# o
npm run dev
```

Abre `http://localhost:3000/login`.

## Credenciales de administrador (por defecto)

- Correo: `admin@admin.com`
- Contraseña: `admin123`

---

## Autenticación — dos mecanismos, dos audiencias

Esta app distingue **quién consume la aplicación** y usa un mecanismo de
sesión distinto para cada uno:

| Consumidor | Ruta protegida | Mecanismo | Middleware |
|---|---|---|---|
| Navegador (vistas) | `/`, `/usuarios`, `/crear-usuarios`, etc. | Cookie `admin=true` (httpOnly) | `authGuard` |
| API REST | `/api/usuarios/*` | JWT (`Authorization: Bearer <token>`) | `authenticateJWT` |

### ¿Por qué separar así?

Las vistas se renderizan del lado del servidor y las visita un navegador
humano de forma directa (no tiene sentido pedirle que pegue un token). La
API, en cambio, está pensada para ser **consumida por cualquier cliente**
(Postman, una app móvil, un frontend separado en otro dominio) — ahí el
estándar es JWT, portable y sin depender de cookies del navegador.

### ¿Dónde se guarda el token?

Cuando el administrador hace login en `/login` (formulario web), el
servidor genera el JWT y lo entrega en **dos cookies**:

- `admin=true` — `httpOnly`, la usa `authGuard` para las vistas. El
  JavaScript del navegador nunca puede leerla (mitiga XSS sobre esa cookie).
- `token=<jwt>` — **no** `httpOnly`, a propósito: el JavaScript de las
  vistas (`crearUsuarios.handlebars`, `actualizarUsuario.handlebars`,
  `perfilUsuario.handlebars`) necesita leerla para armar el header
  `Authorization: Bearer <token>` en sus llamadas `fetch()` a la API.

> Nota de seguridad: en una SPA "real" (separada del backend) lo más común
> es guardar el JWT en memoria (una variable JS) en vez de una cookie
> legible, para reducir superficie ante XSS. Aquí, al ser vistas
> server-rendered del mismo origen, se optó por una cookie simple para no
> complejizar el flujo — es una decisión consciente de alcance del ABP, no
> un patrón recomendado para producción a gran escala.

Un **cliente externo** (Postman, mobile, etc.) no usa cookies en absoluto:
llama a `POST /api/auth/login` con JSON y recibe el token directo en el
body de la respuesta.

### ¿Por qué proteger justo esas rutas?

Se protegió **toda la API `/api/usuarios/*`** (no solo 2 rutas puntuales)
porque cada endpoint expone o modifica datos clínicos de pacientes — no
existe ningún caso de uso donde deba quedar público. Esto incluye
explícitamente las 2 rutas mínimas que pide la consigna, y de hecho las
supera: `GET`, `POST`, `PUT`, `DELETE` y la nueva subida de foto
(`POST /:id/foto`) requieren todas un JWT válido y **no funcionan sin él**
(devuelven `401` inmediatamente si falta o es inválido/expiró).

---

## Endpoints

### Vistas (protegidas por cookie de sesión)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/login` | Formulario de login |
| POST | `/login` | Procesa login, setea cookies `admin` y `token` |
| POST | `/logout` | Cierra sesión, limpia ambas cookies |
| GET | `/` | Home |
| GET | `/crear-usuarios` | Formulario de creación |
| GET | `/usuarios` | Listado de pacientes |
| GET | `/usuarios/perfil/:id` | Perfil de paciente (incluye foto y formulario de subida) |
| GET | `/usuarios/actualizar/:id` | Formulario de edición |
| GET | `/usuarios/eliminar/:id` | Elimina y redirige al listado |

### API REST (JSON, protegida por JWT salvo donde se indique)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Pública | Devuelve `{ token, tokenType, expiresIn }` |
| GET | `/api/usuarios` | JWT | Lista pacientes (`?nombre=` busca por nombre o apellido) |
| GET | `/api/usuarios/sql` | JWT | Mismo listado, vía SQL manual (comparación con ORM) |
| GET | `/api/usuarios/:id` | JWT | Detalle de un paciente |
| POST | `/api/usuarios` | JWT | Crea un paciente |
| PUT | `/api/usuarios/:id` | JWT | Actualiza un paciente |
| DELETE | `/api/usuarios/:id` | JWT | Elimina un paciente |
| POST | `/api/usuarios/:id/foto` | JWT | Sube/reemplaza la foto de perfil (`multipart/form-data`, campo `foto`) |

Todas las respuestas de la API siguen el mismo formato:

```json
{ "status": "success", "message": "...", "data": { } }
```

```json
{ "status": "error", "message": "...", "data": null }
```

---

## Probar con Postman / curl

**1. Login y obtención del token**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@admin.com","password":"admin123"}'
```

Respuesta:
```json
{
  "status": "success",
  "message": "Autenticación exitosa.",
  "data": { "token": "eyJhbGciOi...", "tokenType": "Bearer", "expiresIn": "2h" }
}
```

**2. Llamar a una ruta protegida con el token**

```bash
curl http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer eyJhbGciOi..."
```

**3. Sin token → 401**

```bash
curl http://localhost:3000/api/usuarios
# { "status": "error", "message": "Token de autenticación no proporcionado.", "data": null }
```

**4. Subir la foto de un paciente**

```bash
curl -X POST http://localhost:3000/api/usuarios/<ID_PACIENTE>/foto \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -F "foto=@/ruta/local/a/imagen.jpg"
```

En Postman: método `POST`, pestaña **Body → form-data**, key `foto` tipo
**File**, y en **Headers** agregar `Authorization: Bearer <token>`.

---

## Subida de archivos — foto de perfil del paciente

- **Middleware**: `src/middlewares/upload.middleware.js`, usando `multer`
  con almacenamiento en disco (`diskStorage`).
- **Carpeta destino**: `public/uploads/pacientes/` (se sirve como estática
  vía `express.static`, así que la foto queda accesible directo en
  `http://localhost:3000/uploads/pacientes/<archivo>`).
- **Validaciones**:
  - Tipo de archivo: solo `image/jpeg`, `image/png`, `image/webp`.
  - Tamaño máximo: 2MB.
  - Si el tipo o tamaño no son válidos, la API responde `400` con el
    formato `{ status, message, data }` (no una página de error de Express).
- **Persistencia en base de datos**: el archivo en sí vive en el
  filesystem; la tabla `usuarios` (PostgreSQL) solo guarda la **ruta
  relativa** en la nueva columna `foto` (ej.
  `/uploads/pacientes/3f2a1b40-....jpg`). Cada subida además crea un
  registro en `Historial` (`accion: "ACTUALIZACIÓN"`), quedando trazado en
  base de datos cuándo se actualizó la foto de cada paciente.
- Si el paciente ya tenía una foto, el archivo anterior se borra del disco
  al subir una nueva (evita archivos huérfanos acumulándose).

## Notas sobre cambios de esta entrega (Módulo 8)

- Se agregó `jsonwebtoken` y `multer` a las dependencias (y se completó
  `package.json`, que no tenía `sequelize`/`pg`/`dotenv` pese a que el
  código ya los usaba).
- Nuevo `src/utils/jwt.js` (firma/verificación) y
  `src/middlewares/jwt.middleware.js` (`authenticateJWT`), que reemplaza a
  `authGuard` específicamente en `usuarios.routes.js`.
- Nuevo endpoint `POST /api/auth/login` para clientes externos.
- El login web (`auth.controllers.js`) ahora también genera un JWT y lo
  entrega en la cookie `token` (no httpOnly), además de la cookie `admin`
  original.
- Nueva columna `Usuario.foto` (Sequelize `sync({ alter: true })` la crea
  sola al levantar el servidor, no requiere migración manual).
- Nuevo endpoint `POST /api/usuarios/:id/foto` y su middleware `multer`.
- Vistas actualizadas: `crearUsuarios`, `actualizarUsuario` y
  `perfilUsuario` ahora envían `Authorization: Bearer <token>` en sus
  llamadas a la API; `perfilUsuario` y `usuarios` muestran la foto (o
  iniciales como placeholder si no hay foto aún).

## Verificación rápida

1. `npm install` y ejecuta el servidor.
2. Ve a `/login`, entra con las credenciales de administrador.
3. Crea un paciente nuevo desde `/crear-usuarios`.
4. Entra a su perfil (`/usuarios/perfil/:id`) y sube una foto.
5. Recarga: la foto debe verse en el perfil y en el listado (`/usuarios`).
6. Prueba también vía Postman: login → copiar token → `GET /api/usuarios`
   sin token (401) y con token (200).
