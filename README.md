# Baseball Tracker - Strikes & Balls

Aplicación de seguimiento de partidos de béisbol en tiempo real.

## Configuración para Railway

### Requisitos previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Railway](https://railway.app)

### Paso 1: Descargar y preparar el proyecto

1. Descarga el proyecto como un archivo ZIP
2. Descomprime el archivo en tu computadora
3. Abre una terminal y navega hasta la carpeta del proyecto

### Paso 2: Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón "New" para crear un nuevo repositorio
3. Nombra tu repositorio (por ejemplo, "baseball-tracker")
4. Deja las demás opciones por defecto y haz clic en "Create repository"
5. Sigue las instrucciones para "push an existing repository from the command line":

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/baseball-tracker.git
git push -u origin main
\`\`\`

### Paso 3: Configurar el proyecto en Railway

1. Ve a [Railway](https://railway.app) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub si aún no lo has hecho
5. Selecciona el repositorio "baseball-tracker"
6. Railway comenzará a desplegar automáticamente tu aplicación

### Paso 4: Agregar una base de datos PostgreSQL

1. En el dashboard de tu proyecto en Railway, haz clic en "New"
2. Selecciona "Database" y luego "PostgreSQL"
3. Railway creará una nueva base de datos PostgreSQL para tu proyecto
4. Una vez creada, haz clic en la base de datos para ver sus detalles
5. En la pestaña "Connect", copia la "Connection URL"

### Paso 5: Configurar variables de entorno

1. En el dashboard de tu proyecto en Railway, selecciona el servicio de tu aplicación (no la base de datos)
2. Ve a la pestaña "Variables"
3. Agrega las siguientes variables:
   - `DATABASE_URL`: Pega la URL de conexión que copiaste en el paso anterior
   - `NODE_ENV`: Establece el valor como "production"

### Paso 6: Reiniciar el despliegue

1. En el dashboard de tu proyecto en Railway, selecciona el servicio de tu aplicación
2. Ve a la pestaña "Deployments"
3. Haz clic en "Deploy" para iniciar un nuevo despliegue con las variables de entorno configuradas

### Paso 7: Acceder a tu aplicación

1. Una vez completado el despliegue, Railway te proporcionará una URL para acceder a tu aplicación
2. Haz clic en la URL o cópiala en tu navegador para acceder a la aplicación

## Desarrollo local

Para ejecutar la aplicación localmente:

1. Crea un archivo `.env` basado en `.env.example` y configura tus variables de entorno
2. Instala las dependencias:

\`\`\`bash
npm install
\`\`\`

3. Inicia el servidor de desarrollo:

\`\`\`bash
npm run dev
\`\`\`

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Notas adicionales

- La aplicación utiliza PostgreSQL para almacenar los datos de los juegos
- En el entorno de desarrollo, se utiliza un servicio mock para simular la base de datos
- En producción, se utilizan las API routes de Next.js para interactuar con la base de datos.
