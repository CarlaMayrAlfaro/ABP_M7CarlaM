# MediGest — ABP M7

Aplicación para gestionar pacientes usando **Express** (backend), **Handlebars** (páginas web) y **PostgreSQL** (base de datos).

## ¿Qué hace esta app?

✅ Crear, editar, ver y eliminar información de pacientes  
✅ Guardar observaciones sobre cada paciente  
✅ Registrar automáticamente qué cambios se hacen y cuándo  
✅ Proteger la app con login de administrador  
✅ Usar una base de datos real (PostgreSQL)

## Lo que necesitas

- **Node.js** v16+ 
- **npm** (viene con Node.js)
- **PostgreSQL** ejecutándose en tu computadora

## Cómo instalar y usar

### 1️⃣ Descarga y prepara el proyecto

```bash
# Instala los paquetes necesarios
npm install
```

### 2️⃣ Configura la base de datos

Crea un archivo `.env` en la carpeta raíz (la misma donde está `package.json`):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medigest
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña

ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123
```

**⚠️ Importante:** Reemplaza `tu_usuario_postgres` y `tu_contraseña` con los datos que usas en PostgreSQL.
DB_NAME =Cada persona usa el nombre de SU base de datos, solo tiene que coincidir con el nombre real en PostgreSQL.

### 3️⃣ Inicia el servidor

```bash
node server.js --puerto 3001
```

Verás esto en la terminal:
```
✅ Conexión a PostgreSQL establecida correctamente.
✅ Base de datos sincronizada correctamente.
Servidor escuchando en http://localhost:3001
```

### 4️⃣ Entra a la app

Abre el navegador y ve a:
```
http://localhost:3001/login
```

Usa estas credenciales:
- **Correo:** `admin@admin.com`
- **Contraseña:** `admin123`

---

## Estructura de carpetas (la basica)

```
📦 MediGest
├── 📁 public              ← Imágenes y estilos (CSS)
├── 📁 src
│   ├── 📁 config          ← Conexión a PostgreSQL
│   ├── 📁 controllers     ← La lógica de cada página
│   ├── 📁 logs            ← Registro de solicitudes
│   ├── 📁 middlewares     ← Protección de rutas
│   ├── 📁 models          ← Estructura de datos (usuarios, historial)
│   ├── 📁 routes          ← URLs de la app
│   └── 📁 views           ← Las páginas HTML (Handlebars)
├── app.js                 ← Configuración de Express
├── server.js              ← Inicia el servidor
├── package.json           ← Lista de paquetes
├── .env                   ← Datos privados (usuario, contraseña)
└── README.md              ← Este archivo

```

## Lo que puedes hacer

### En la web (usando el navegador)

- **Ver pacientes:** Ve a `/usuarios`
- **Agregar paciente:** Ve a `/crear-usuarios`
- **Editar paciente:** Haz clic en un paciente para ver su perfil y editar sus datos (nombre, correo, observaciones)
- **Cerrar sesión:** Haz clic en "Logout"

### Con Postman (programa para probar APIs)

**1. Inicia sesión:**
```
POST http://localhost:3001/login
Body: { "correo": "admin@admin.com", "password": "admin123" }
```

**2. Ver todos los pacientes:**
```
GET http://localhost:3001/api/usuarios
```

**3. Crear nuevo paciente:**
```
POST http://localhost:3001/api/usuarios
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com"
  "observaciones": "Diabetes Mellitus tipo 2"
}
```

**4. Editar paciente (agregar observaciones):**
```
PUT http://localhost:3001/api/usuarios/[ID_DEL_PACIENTE]
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "observaciones": "Paciente con DM2"
}
```

**5. Eliminar paciente:**
```
DELETE http://localhost:3001/api/usuarios/[ID_DEL_PACIENTE]
```

> **Nota:** Reemplaza `[ID_DEL_PACIENTE]` con el ID real del paciente (lo ves cuando haces GET).

---

## ¿Cómo funciona?

### 1. **Guardas datos en PostgreSQL** 📊
Cuando creas o editas un paciente, la información se guarda en una base de datos real (PostgreSQL), no en un archivo.

### 2. **Se registra el historial** 📝
Cada acción (crear, editar, eliminar) se guarda automáticamente en el "historial" del paciente.

### 3. **Proteges con login** 🔐
Solo el administrador (con correo y contraseña) puede ver y editar pacientes.

### 4. **Usas Sequelize** 🔗
Es una herramienta que facilita trabajar con la base de datos sin escribir SQL complicado.

---

## Cambios principales en M7

✨ **PostgreSQL:** Antes guardábamos en un archivo JSON, ahora usamos una base de datos real  
✨ **Sequelize ORM:** Hace más fácil comunicarse con PostgreSQL  
✨ **Observaciones:** Nuevo campo para anotaciones clínicas  
✨ **Historial automático:** Se registra quién cambió qué y cuándo  
✨ **Tablas:** Se crean automáticamente cuando inicias la app  

---

## Si algo no funciona

### Error: "no existe la relación"
→ Probablemente PostgreSQL no está corriendo. Abre el programa de PostgreSQL.

### Error: "no se puede conectar"
→ Verifica que los datos en `.env` sean correctos.

### No veo los datos
→ Asegúrate de haber hecho login primero con las credenciales correctas.

### ¿Cómo revisar la base de datos?
Abre **pgAdmin** (programa que viene con PostgreSQL) o usa este comando en terminal:
```bash
psql -U tu_usuario_postgres -d medigest
SELECT * FROM usuarios;
```

---

## Resumen rápido

| Lo que quieres | Cómo hacerlo |
|---|---|
| Crear paciente | Web: `/crear-usuarios` o POST a `/api/usuarios` |
| Ver pacientes | Web: `/usuarios` o GET a `/api/usuarios` |
| Editar paciente | Web: click en paciente + formulario o PUT a `/api/usuarios/ID` |
| Eliminar paciente | Web: botón eliminar o DELETE a `/api/usuarios/ID` |
| Agregar observaciones | Editar paciente + campo "Observaciones" |
