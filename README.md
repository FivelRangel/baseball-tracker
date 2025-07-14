
⚾ Baseball Tracker - Strikes & Balls
Una aplicación web de seguimiento de partidos de béisbol en tiempo real, diseñada para registrar y gestionar fácilmente los eventos de un juego. Ideal para anotadores, entrenadores o cualquier aficionado que quiera llevar un control detallado de cada partido.

🌟 Características Principales
Seguimiento en Tiempo Real: Registra lanzamientos (bolas y strikes), outs, hits y otros eventos importantes del partido a medida que ocurren, manteniendo un marcador preciso.

Gestión de Múltiples Partidos: Crea y gestiona fácilmente varios partidos de béisbol, permitiéndote volver a ellos en cualquier momento.

Base de Datos Robusta: Utiliza PostgreSQL para el almacenamiento persistente y seguro de datos en entornos de producción, asegurando la integridad de la información de tus partidos.

Desarrollo Flexible: Soporte para desarrollo local con un servicio de datos simulado, facilitando las pruebas y el desarrollo sin necesidad de una base de datos externa de inmediato.

Implementación Sencilla: Diseñado para una implementación eficiente y rápida en plataformas modernas de despliegue como Railway.

🚀 Tecnologías Utilizadas
Este proyecto se construye con un stack de tecnologías moderno y robusto:

Next.js: Un potente framework de React para el desarrollo de la interfaz de usuario de alto rendimiento y las rutas API para la interacción con la base de datos.

TypeScript: Un superconjunto de JavaScript que añade tipado estático, mejorando la robustez del código, la detección de errores en tiempo de desarrollo y la mantenibilidad.

PostgreSQL: Un sistema de gestión de bases de datos relacionales de código abierto, reconocido por su fiabilidad, características robustas y rendimiento en entornos de producción.

CSS: Utilizado para el estilo y la presentación visual atractiva de la interfaz de usuario, garantizando una experiencia de usuario intuitiva.

🛠️ Cómo Empezar
Sigue estas instrucciones para poner en marcha el proyecto, ya sea para desarrollo local o para un despliegue en la nube.

Desarrollo Local
Para ejecutar la aplicación en tu máquina local:

Clona el Repositorio:

Bash

git clone https://github.com/FivelRangel/baseball-tracker.git
cd baseball-tracker
Configura las Variables de Entorno:
Crea un archivo .env en la raíz de tu proyecto. Puedes usar el archivo .env.example como plantilla. Para el desarrollo local, no es necesario configurar DATABASE_URL ya que la aplicación utiliza un servicio de datos simulado por defecto.

Ejemplo de .env (si se necesitaran otras variables en el futuro):

# DATABASE_URL="tu_url_de_base_de_datos_si_la_usaras_localmente"
# NODE_ENV="development"
Instala las Dependencias:

Bash

npm install
Inicia el Servidor de Desarrollo:

Bash

npm run dev
La aplicación estará accesible en tu navegador en http://localhost:3000.

Despliegue en Railway
Para desplegar la aplicación en un entorno de producción usando Railway:

Crea Cuentas:
Asegúrate de tener cuentas activas en GitHub y Railway.

Prepara tu Repositorio de GitHub:
Asegúrate de que tu proyecto esté alojado en un repositorio de GitHub. Si aún no lo has hecho, sube tu código.

Despliega en Railway:

Inicia sesión en tu panel de control de Railway.

Haz clic en "New Project" y selecciona "Deploy from GitHub Repo".

Conecta tu repositorio baseball-tracker y selecciona la rama principal (main o master).

Añade una Base de Datos PostgreSQL:

Dentro de tu proyecto recién creado en Railway, haz clic en "Add new" y selecciona "PostgreSQL Database".

Railway aprovisionará una base de datos y generará automáticamente una DATABASE_URL para ella.

Configura las Variables de Entorno en Railway:
Ve a la sección "Variables" de tu proyecto en Railway y añade las siguientes:

DATABASE_URL: Pega aquí el URL de conexión a tu base de datos PostgreSQL (proporcionado por Railway).

NODE_ENV: Establece su valor en production.

Reinicia el Despliegue:
Después de configurar las variables de entorno, es crucial reiniciar el despliegue de tu aplicación en Railway para que estos cambios surtan efecto.

Accede a la Aplicación:
Una vez que el despliegue sea exitoso, Railway te proporcionará un dominio público para acceder a tu aplicación.

📈 Uso
Una vez en funcionamiento, la aplicación te permitirá:

Iniciar un nuevo partido de béisbol.

Registrar eventos del juego en tiempo real, como strikes, bolas, outs, etc.

Visualizar el estado actual del partido de manera clara e intuitiva.

🤝 Contribuciones
¡Las contribuciones de la comunidad son bienvenidas y muy apreciadas! Si deseas mejorar este proyecto o añadir nuevas funcionalidades, por favor, sigue estos pasos:

Haz un "fork" de este repositorio (Fork).

Crea una nueva rama para tu funcionalidad o corrección (git checkout -b feature/nombre-de-tu-funcionalidad o fix/nombre-de-tu-arreglo).

Realiza tus cambios y haz "commit" de ellos (git commit -am 'feat: Añadir nueva funcionalidad' o fix: Corregir error X).

Sube tus cambios a tu rama en tu repositorio "forkeado" (git push origin feature/nombre-de-tu-funcionalidad).

Abre un "Pull Request" a la rama main de este repositorio, describiendo claramente tus cambios.

📄 Licencia
Este proyecto está bajo la Licencia MIT. Esto significa que puedes usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, con la única condición de incluir el aviso de derechos de autor y el aviso de la licencia en todas las copias o porciones sustanciales del software.

Consulta el archivo LICENSE en la raíz del repositorio para obtener el texto completo de la licencia.

¡Espero que este README profesional impulse tu proyecto! Si necesitas alguna otra adaptación o tienes preguntas, no dudes en consultarme.
