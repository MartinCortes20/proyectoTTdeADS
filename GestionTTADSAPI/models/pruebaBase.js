const { getConnection } = require('../models/sqlConnection.js');

const testQuery = async () => {
	try {
		const pool = await getConnection();
		const [rows] = await pool.query('SELECT * FROM Alumnos'); //? prueba de una seleciion para obtencion de datos
		console.log(rows);
	} catch (error) {
		console.error('Error ejecutando la consulta:', error.message);
	}
};

testQuery();
