Gestión TT

Este es un proyecto de Gestión TT, una aplicación web desarrollada con React en el frontend y un backend en Node.js. 
El propósito de la aplicación es permitir a los usuarios gestionar acciones mediante un sistema de login, registro y selección de acciones, así como generar un reporte PDF con la evaluación de un protocolo de trabajo terminal.
Esta evaluacion de protocolo es un paso antes a llegar a TT1 y despues a TT2, por eso se crea esta herramienta para llevar un control desde una web y mantener a la comunidad informada sobre su proceso de protocolo.


Tecnologías Usadas

Frontend
	•	React: Librería para construir interfaces de usuario interactivas.
	•	Tailwind CSS: Framework de CSS para crear interfaces de usuario modernas y personalizadas de manera rápida.

Backend
	•	Node.js: Entorno de ejecución para JavaScript en el servidor.
	•	Express: Framework web para Node.js que facilita la creación de aplicaciones y APIs.
	•	Sequelize: ORM para interactuar con bases de datos SQL como MySQL, PostgreSQL, etc.
	•	MySQL: Sistema de gestión de bases de datos relacional.

Dependencias

Backend
	•	bcrypt: Librería para encriptar contraseñas de forma segura utilizando el algoritmo de hashing bcrypt.
	•	bcryptjs: Versión de bcrypt en JavaScript puro (sin dependencias nativas), utilizada para encriptar contraseñas.
	•	body-parser: Middleware para analizar cuerpos de solicitudes HTTP (JSON, URL encoded).
	•	cors: Middleware para habilitar el acceso desde diferentes dominios (CORS).
	•	dotenv: Carga variables de entorno desde un archivo .env para gestionar configuraciones de la aplicación.
	•	ejs: Motor de plantillas para generar HTML dinámico.
	•	express: Framework para construir aplicaciones web y APIs en Node.js.
	•	jsonwebtoken: Librería para crear y verificar JSON Web Tokens (JWT), útil para autenticación de usuarios.
	•	morgan: Middleware para registrar las solicitudes HTTP, útil para la depuración.
	•	mysql2: Cliente de MySQL para interactuar con bases de datos MySQL.
	•	sequelize: ORM para interactuar con bases de datos SQL, usando un enfoque orientado a objetos.
	•	jsPDF: Librería para generar archivos PDF en el backend.

Instalación
	1.	Clona este repositorio en tu máquina local:


    git clone https://github.com/MartinCortes20/proyectoTTdeADS


    2.	Instala las dependencias del frontend:

    cd gestionttweb
    npm install

    3.	Instala las dependencias del backend:

    cd GestionTTAPI
    npm install

        3.1. Y para la generacion de PDF

        cd generatePDF
        npm install


    4.	Crea un archivo .env en la raíz del proyecto y define las variables de entorno necesarias, como la configuración de la base de datos y las claves de JWT.

    De esta manera 
    DB_SERVER=localhost
    DB_USER=<usuario>
    DB_PASSWORD=<contrasena>
    DB_NAME=GestionTT
    SECRETKEY=cLaaVe_SecReeTTa


Uso
	1.	Para iniciar el backend,front,y generatePDF en el directorio del backend, ejecuta:

    npm start o npm run dev 


Rutas

Backend
	•	Gestión de usuarios y acciones: http://localhost:8080/api/gestionTT/<ruta_aqui>, donde <ruta_aqui> será la ruta correspondiente para cada acción relacionada con usuarios y otros recursos.

PDF
	•	Generación de PDF de Calificación: http://localhost:3000/generarPDFcalificacion, esta ruta permite generar un PDF con la evaluación de un protocolo de trabajo terminal.

Frontend
	•	Ruta del frontend: http://localhost:<puerto_aqui>, donde <puerto_aqui> es el puerto que uses para el frontend, generalmente configurado en tu archivo .env o en el script de inicio.

Funcionalidades
	•	Login: Los usuarios pueden autenticarse mediante un sistema de login con JWT.
	•	Registro: Los nuevos usuarios pueden registrarse en el sistema con una contraseña segura.
	•	Selección de acciones: Después de iniciar sesión, los usuarios pueden escoger acciones que gestionarán a través de la aplicación.
	•	Generación de PDF de Calificación: Los sinodales pueden generar un PDF con la evaluación de un protocolo de trabajo terminal.

Generación de PDF de Calificación

El backend incluye una funcionalidad para generar un archivo PDF con la evaluación de un protocolo de trabajo terminal. El PDF se genera a partir de una solicitud HTTP y contiene la información de un protocolo específico, así como las respuestas de evaluación de un sinodal.

Endpoint para Generar el PDF
	•	Ruta: /generate-pdf
	•	Método: POST
	•	Parámetros en el cuerpo de la solicitud:
	•	id_protocolo: El ID del protocolo que se desea evaluar.
	•	sinodal: La clave del sinodal que está realizando la evaluación.




