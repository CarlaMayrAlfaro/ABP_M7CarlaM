# MediGest — ABP M6

Pequeña aplicación Express + Handlebars para gestión de pacientes (ejemplo).

## Resumen

- Rutas de vistas protegidas por login de administrador.
- Navbar oculto hasta iniciar sesión.
- IDs de usuarios acortados a 8 caracteres.
- Usos de paquetes para el desarrollo del backend

## Requisitos

- Node.js v16+ (o compatible)
- npm

## Instalación

1. Instala dependencias:

```bash
npm install
```

2. Inicia la aplicación (ejemplo puerto 3000):

```bash
node server.js --puerto 3000
# o
npm run dev
```

3. Abre en el navegador:

- `http://localhost:3000/login` — formulario de acceso (ruta renderizada por Express)

## Estructura de carpetas

- `/public` — recursos estáticos accesibles desde el navegador.
  - `/public/css` — hojas de estilo CSS.
  - `/public/img` — imágenes usadas en la app.

- `/src` — código principal de la aplicación.
  - `/src/controllers` — controladores que gestionan la lógica de rutas.
    - `auth.controllers.js` — acciones de login y logout.
    - `usuarios.controllers.js` — operaciones sobre usuarios.
    - `views.controllers.js` — renderizado de vistas.
  - `/src/data` — datos de prueba y almacenamiento local.
    - `usuarios.json` — lista inicial de usuarios.
  - `/src/logs` — archivos de registro.
    - `log_request.txt` — historial de solicitudes HTTP.
  - `/src/middlewares` — funciones intermedias para Express.
    - `auth.middleware.js` — protege rutas privadas.
    - `validate_body.js` — valida datos entrantes.
  - `/src/models` — modelos de datos.
    - `Usuario.model.js` — crea usuarios y genera IDs.
  - `/src/routes` — definición de rutas.
    - `auth.routes.js` — rutas de autenticación.
    - `usuarios.routes.js` — rutas de usuario y API.
    - `views.routes.js` — rutas de páginas renderizadas.
  - `/src/utils` — utilidades de la aplicación.
    - `persistencia.js` — lectura y escritura de datos JSON.
  - `/src/views` — plantillas Handlebars para las páginas.
    - `layouts/main.handlebars` — plantilla base.
    - `partials/navbar.handlebars` — fragmento de barra de navegación.

- `server.js` — punto de entrada del servidor Express.
- `package.json` — dependencias y scripts del proyecto.
- `README.md` — documentación del proyecto.

## Credenciales de administrador (por defecto)

- Correo: `admin@admin.com`
- Contraseña: `admin123`

Al iniciar sesión con esas credenciales se mostrará el navbar y las vistas protegidas.

## Rutas principales

- `GET /login` — formulario de login
- `POST /login` — procesar login
- `POST /logout` — cerrar sesión
- `GET /` — home (protegido)
- `GET /crear-usuarios` — vista creación (protegido)
- `GET /usuarios` — listar usuarios (protegido)
- `GET /usuarios/perfil/:id` — ver perfil (protegido)
- `API: /api/usuarios` — endpoints REST para usuarios

## Notas sobre cambios recientes

- Se modificó `src/models/Usuario.model.js` para generar IDs cortos: `uuidV4().slice(0,8)`.
- Se actualizaron los `id` existentes en `src/data/usuarios.json` a 8 caracteres.
- Se agrega carpeta Public para contener los estilos e imagenes
- Se mejora estilos de la carpeta views usando boostrap

## Verificación rápida

1. Ejecuta el servidor.
2. Navega a `http://localhost:3000/login`.
3. Usa las credenciales de administrador.
4. Verifica que el navbar aparezca y que las rutas protegidas sean accesibles.

## Esquema visual del flujo cliente-servidor

![Flujo cliente servidor](/flujo_login_sesion_cookie.png)

## Imagen del servidor en funcionamiento

![Imagen del Servidor](/image.png)
