# Entipedia - Coding Challenge

<div align="center">
  <img src="public/images/EntipediaLogoBlack.png" alt="Entipedia Logo" width="300"/>
</div>

Una plataforma SaaS moderna para la gestión empresarial que ayuda a organizaciones a administrar sus proyectos, clientes y archivos de manera eficiente.

## Descripción

Este proyecto es un MVP funcional de **Entipedia**, desarrollado como parte de un desafío técnico. La aplicación permite gestionar proyectos mediante un tablero Kanban, administrar clientes con una tabla interactiva, y gestionar archivos con almacenamiento en la nube.

## Características Principales

### Página de Proyectos
- **Tablero Kanban** con drag & drop para visualizar proyectos por estatus
- Propiedades de proyecto:
  - Nombre
  - Descripción
  - Estatus (selección múltiple)
  - Prioridad (selección múltiple)
  - Fecha y hora de creación
- Funcionalidades:
  - Drag & Drop entre columnas (actualiza el estatus automáticamente)
  - Crear proyecto con formulario modal
  - Editar proyecto
  - Eliminar proyecto

### Página de Clientes
- **Tabla interactiva** con todas las funcionalidades requeridas
- Columnas:
  - Nombre
  - Tipo (Persona o Compañía)
  - Valor (moneda en pesos dominicanos - DOP)
  - Desde (fecha)
  - Hasta (fecha)
- Funcionalidades:
  - Paginación (10 clientes por página)
  - Edición inline en la tabla
  - Crear cliente con formulario modal
  - Eliminar cliente
  - Búsqueda

### Página de Archivos
- **Sistema de gestión de archivos** con almacenamiento en AWS S3
- Propiedades de archivo:
  - Nombre
  - Descripción
  - Tipo de archivo (basado en extensión)
  - Fecha de creación
- Funcionalidades:
  - Listar archivos (vista de tabla y tarjetas)
  - Cargar archivos con formulario y drag & drop
  - Descargar archivos
  - Eliminar archivos
  - Almacenamiento en AWS S3

### Autenticación y Workspaces
- Sistema de autenticación con NextAuth
- Gestión de múltiples workspaces
- Verificación de email
- Recuperación de contraseña
- Invitaciones a workspaces

### Dashboard
- Vista general con estadísticas
- Gráficos de proyectos por estatus
- Clientes recientes

## Stack Tecnológico

### Tecnologías Requeridas
- **TypeScript** - Lenguaje de programación
- **React 19** - Biblioteca de UI
- **Next.js 16** - Framework React con App Router
- **PostgreSQL** - Base de datos relacional
- **Drizzle ORM** - ORM para TypeScript
- **GitHub** - Control de versiones

### Tecnologías Utilizadas
- **NextAuth v5** - Autenticación y autorización
- **Zod** - Validación de esquemas
- **AWS S3** - Almacenamiento de archivos en la nube
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Framework de estilos
- **@dnd-kit** - Drag & Drop para Kanban
- **React Hook Form** - Manejo de formularios
- **Recharts** - Gráficos y visualizaciones
- **Nodemailer** - Envío de emails (configurado con Gmail SMTP)
- **bcryptjs** - Hash de contraseñas
- **Docker** - Contenedorización de PostgreSQL

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ y npm
- **Docker** y Docker Compose (para la base de datos)
- **Cuenta de AWS** con acceso a S3 (para almacenamiento de archivos)
- **Cuenta de Gmail** con App Password configurada (requerido para funcionalidades de email mediante Gmail SMTP)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
gh repo clone Alexcab24/entipedia-coding-challenge
cd entipedia-coding-challenge
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
DB_USER=usuario
DB_NAME=nombre_base_datos
DB_PASSWORD=contraseña

# NextAuth
AUTH_SECRET=tu_secret_key_generada_aleatoriamente

# AWS S3 (para almacenamiento de archivos)
S3_REGION=us-east-1
S3_ACCESS_KEY=tu_access_key
S3_SECRET_KEY=tu_secret_key
S3_BUCKET_NAME=nombre_del_bucket

# Email - Gmail SMTP (requerido para verificación de email, recuperación de contraseña e invitaciones)
# Para Gmail, necesitas generar un "App Password" en tu cuenta de Google
MAIL_USER=tu_email@gmail.com
MAIL_APP_PASSWORD=tu_app_password_de_gmail
MAIL_FROM_NAME="Entipedia Challenge"

# URL de la aplicación (para emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota:** Para generar `AUTH_SECRET`, puedes ejecutar:
```bash
openssl rand -base64 32
```

### 4. Iniciar PostgreSQL con Docker

```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432.

### 5. Ejecutar migraciones de base de datos

```bash
npm run db:migrate
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run db:generate` - Genera migraciones de Drizzle
- `npm run db:migrate` - Ejecuta las migraciones de base de datos
- `npm run db:seed` - Pobla la base de datos con datos de ejemplo
- `npm run db:seed:challenge` - Pobla la base de datos con datos específicos del challenge

## Autenticación

El sistema utiliza NextAuth v5 con autenticación por credenciales. Las características incluyen:

- Registro de usuarios
- Verificación de email (envío mediante Gmail SMTP)
- Login con email y contraseña
- Recuperación de contraseña (envío mediante Gmail SMTP)
- Gestión de sesiones JWT

**Nota importante:** El envío de correos electrónicos (verificación de email, recuperación de contraseña, invitaciones) es **requerido** y se realiza mediante **Gmail SMTP** utilizando Nodemailer. Es obligatorio configurar una App Password de Gmail en las variables de entorno para que la aplicación funcione correctamente.

## Almacenamiento de Archivos

Los archivos se almacenan en **AWS S3**. Asegúrate de:

1. Crear un bucket en S3
2. Configurar las credenciales de AWS en las variables de entorno
3. Configurar los permisos apropiados del bucket

## UI/UX

La aplicación utiliza:
- **shadcn/ui** para componentes base
- **Tailwind CSS** para estilos
- Diseño responsive con soporte móvil
- Tema claro/oscuro
- Animaciones y transiciones suaves

## Deployment

Para desplegar la aplicación en producción:

1. **Configurar variables de entorno** en tu proveedor de hosting
2. **Configurar la base de datos** PostgreSQL (puede ser un servicio gestionado)
3. **Configurar AWS S3** con las credenciales apropiadas
4. **Construir la aplicación:**
   ```bash
   npm run build
   ```
5. **Ejecutar migraciones** en la base de datos de producción
6. **Iniciar el servidor:**
   ```bash
   npm run start
   ```

## Notas Adicionales

- El proyecto incluye funcionalidades adicionales como dashboard, configuración de workspaces, e invitaciones de usuarios
- La aplicación soporta múltiples workspaces por usuario
- Los archivos se validan antes de subirse a S3
- Se implementan validaciones tanto en cliente como en servidor

## Licencia

Este proyecto es parte de un desafío técnico y está destinado únicamente para evaluación.

---

**Desarrollado para Entipedia**
