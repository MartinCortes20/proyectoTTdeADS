const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection'); // Conexión con la base de datos MySQL

// Función para consultar las academias
const getAcademias = async (req = request, res = response) => {
	try {
		const pool = await getConnection();

		// Consulta para obtener todas las academias
		const query = 'SELECT * FROM Academia';
		const [academias] = await pool.execute(query);
		console.log(academias);
		// Validar si se encontraron academias
		if (academias.length === 0) {
			return res.status(404).json({ message: 'No se encontraron academias.' });
		}

		// Responder con las academias obtenidas
		return res.status(200).json({ academias });
	} catch (error) {
		console.error('Error al consultar academias:', error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
	}
};

module.exports = { getAcademias };
