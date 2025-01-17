require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise'); // Se manejan funciones asincrónicas, por eso se usa promise

// Configuración de la conexión
const connectionSettings = {
	host: process.env.DB_SERVER,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 3306,
	waitForConnections: true,
	connectionLimit: 10, // Número máximo de conexiones en el pool
	queueLimit: 0, // Sin límite para la cola de conexiones
};

// Crear el pool de conexiones UNA SOLA VEZ
const pool = mysql.createPool(connectionSettings);

const getConnection = async () => {
	try {
		// Obtener una conexión desde el pool
		const connection = await pool.getConnection();
		
		return connection; // Devolver la conexión sin liberarla
	} catch (error) {
		console.error('Error al conectar con la base de datos:', error.message);
		throw error; // Lanza el error para que el controlador lo capture
	}
};

module.exports = { getConnection };
