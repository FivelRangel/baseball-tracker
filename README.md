⚾ Baseball Tracker - Strikes & Balls
¡Bienvenido al Baseball Tracker, tu compañero ideal para registrar y gestionar partidos de béisbol en tiempo real! 🚀 Esta aplicación web está diseñada para ser intuitiva y robusta, permitiéndote llevar un control detallado de cada jugada, desde un strike hasta un home run. Ya seas un anotador oficial, un entrenador o simplemente un gran aficionado, Baseball Tracker te ofrece las herramientas para no perderte ni un solo detalle del juego.

✨ Lo que puedes hacer con Baseball Tracker
Aquí te presento las funcionalidades clave que hacen de esta app una herramienta imprescindible para cualquier partido:

Seguimiento en Tiempo Real: ⏱️ Registra cada lanzamiento (bolas y strikes), outs, hits y otros eventos cruciales del partido a medida que ocurren, manteniendo un marcador preciso y actualizado.

Gestión de Múltiples Partidos: 📂 Crea y organiza fácilmente varios partidos de béisbol. Podrás acceder a ellos en cualquier momento, revivir momentos clave o analizar estadísticas pasadas.

Base de Datos Confiable: 💾 Gracias a PostgreSQL, tus datos están seguros y organizados. En entornos de producción, esto asegura una persistencia robusta y la integridad de toda la información de tus partidos.

Desarrollo Ágil y Flexible: 🧑‍💻 Diseñado pensando en los desarrolladores. Cuenta con soporte para un servicio de datos simulado en desarrollo local, lo que te permite empezar a codificar sin necesidad de configurar una base de datos externa de inmediato.

Despliegue Sencillo: ☁️ Optimizado para una implementación rápida y eficiente en plataformas modernas de despliegue como Railway, para que puedas tener tu aplicación funcionando en la nube en cuestión de minutos.

🛠️ Tecnologías que lo Hacen Posible
Este proyecto se construye sobre un stack de tecnologías moderno y de alto rendimiento:

Next.js: El potente framework de React que potencia la interfaz de usuario de alto rendimiento y las rutas API para una comunicación fluida con la base de datos.

TypeScript: El lenguaje de programación principal que añade tipado estático, mejorando la robustez del código, la detección temprana de errores y la mantenibilidad del proyecto a largo plazo.

PostgreSQL: Un sistema de gestión de bases de datos relacionales de código abierto, reconocido por su fiabilidad, su amplio conjunto de características y su excelente rendimiento en entornos de producción.

CSS: Utilizado para dar estilo y una presentación visual atractiva a la interfaz de usuario, garantizando una experiencia intuitiva y agradable para el usuario.

🚀 ¡Manos a la Obra!
Sigue estos sencillos pasos para poner en marcha el Baseball Tracker, ya sea en tu máquina local para desarrollo o desplegándolo en la nube.

💻 Desarrollo Local
Para ejecutar la aplicación en tu entorno de desarrollo personal:

Clona el Repositorio:

Bash

git clone https://github.com/FivelRangel/baseball-tracker.git
cd baseball-tracker
Configura tus Variables de Entorno:
Crea un archivo llamado .env en la raíz de tu proyecto. Puedes basarte en el archivo .env.example si existe. Para desarrollo local, la base de datos se simula, así que no necesitas una DATABASE_URL real por ahora.

# Ejemplo de .env (si se necesitaran más variables en el futuro)
# NODE_ENV="development"
# OTROS_AJUSTES="valor"
Instala las Dependencias:

Bash

npm install
Inicia el Servidor de Desarrollo:

Bash

npm run dev
¡Listo! La aplicación estará disponible en tu navegador en http://localhost:3000.

☁️ Despliegue en Railway
Si quieres que tu aplicación esté disponible online, Railway es una excelente opción:

Asegura tus Cuentas:
Necesitarás tener cuentas activas en GitHub y Railway.

Prepara tu Código en GitHub:
Asegúrate de que tu proyecto Baseball Tracker esté subido y actualizado en un repositorio de GitHub.

Despliega en Railway:

Inicia sesión en tu panel de control de Railway.

Haz clic en "New Project" (Nuevo Proyecto) y selecciona la opción "Deploy from GitHub Repo" (Desplegar desde Repositorio de GitHub).

Conecta tu repositorio baseball-tracker y elige la rama principal (main o master).

Añade una Base de Datos PostgreSQL:

Dentro de tu nuevo proyecto en Railway, haz clic en "Add new" (Añadir nuevo) y selecciona "PostgreSQL Database" (Base de Datos PostgreSQL).

Railway se encargará de aprovisionar la base de datos y generará automáticamente una DATABASE_URL para conectarte a ella.

Configura las Variables de Entorno de Producción:
Dirígete a la sección "Variables" de tu proyecto en Railway y añade las siguientes:

DATABASE_URL: Pega aquí el URL de conexión que Railway te proporcionó para tu base de datos PostgreSQL.

NODE_ENV: Establece su valor en production.

Reinicia el Despliegue:
Es crucial que, después de configurar las variables de entorno, reinicies el despliegue de tu aplicación en Railway para que los cambios surtan efecto.

¡Accede a tu Aplicación!
Una vez que el despliegue se complete con éxito, Railway te proporcionará un dominio público donde podrás acceder a tu Baseball Tracker.

🤝 ¿Quieres Contribuir?
¡Nos encanta recibir contribuciones! Si tienes ideas para mejorar Baseball Tracker o encuentras algún error, te invitamos a que nos ayudes. Sigue estos pasos para colaborar:

Haz un "fork" de este repositorio.

Crea una nueva rama para tus cambios (git checkout -b feature/tu-gran-idea o fix/solucion-de-error).

Realiza tus modificaciones y haz un "commit" descriptivo de ellas (git commit -am 'feat: Implementar marcador de innings' o fix: Corregir error en conteo de outs).

Sube tus cambios a tu rama en tu repositorio "forkeado" (git push origin feature/tu-gran-idea).

Abre un "Pull Request" (PR) hacia la rama main de este repositorio. Por favor, describe claramente los cambios que has realizado.

📄 Licencia
Este proyecto es Open Source y está bajo la prestigiosa Licencia MIT. Esto significa que tienes la libertad de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software. La única condición es que se incluya el aviso de derechos de autor y el aviso de la licencia en todas las copias o porciones sustanciales del software.

Puedes encontrar el texto completo de la licencia en el archivo LICENSE ubicado en la raíz del repositorio.

