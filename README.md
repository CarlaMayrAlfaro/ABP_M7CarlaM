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



