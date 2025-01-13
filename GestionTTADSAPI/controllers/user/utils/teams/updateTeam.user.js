const { request, response } = require('express');
const { getConnection } = require('../../../../models/sqlConnection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Para verificar la contraseña

const updateTeam = async (req = request, res = response) => {
	const { nombre_equipo, titulo, director, director_2, area, contrasena } =
		req.body;
	const token = req.header('log-token'); // Obtener el token del encabezado

	// Validación de parámetros
	if (!token || !contrasena) {
		return res.status(400).json({
			message: 'No se proporcionó el token o la contraseña está vacía.',
		});
	}

	try {
		// Decodificar el token para obtener la boleta (líder)
		const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
		const lider = decoded.boleta || decoded.clave_empleado;

		console.log('Líder identificado con boleta/clave: ', lider);

		// Conexión a la base de datos
		const connection = await getConnection();

		// Obtener el rol del líder (Alumno o Docente)
		const [rows] = await connection.query(
			'SELECT rol FROM Alumnos WHERE boleta = ? UNION SELECT rol FROM Docentes WHERE clave_empleado = ?',
			[lider, lider]
		);

		if (rows.length === 0) {
			return res.status(404).json({
				message: 'Líder no encontrado.',
			});
		}

		const rol = rows[0].rol;

		// Obtener los permisos del rol en la tabla Permisos
		const [permisosRows] = await connection.query(
			'SELECT permisos FROM Permisos WHERE rol = ?',
			[rol]
		);

		if (permisosRows.length === 0) {
			return res.status(403).json({
				message: 'No se encontraron permisos para el rol especificado.',
			});
		}

		const permisos = permisosRows[0].permisos;

		// Verificar si el líder tiene permiso '9' o el permiso 'G'
		if (!permisos.includes('9') && !permisos.includes('G')) {
			return res.status(403).json({
				message: 'No tienes permisos suficientes para realizar esta acción.',
			});
		}

		// Verificar si el líder es realmente el líder del equipo
		const [equipo] = await connection.query(
			"SELECT * FROM Equipos WHERE nombre_equipo = ? AND lider = ? AND estado = 'A'",
			[nombre_equipo, lider]
		);

		if (equipo.length === 0) {
			return res.status(403).json({
				message:
					'El usuario no es líder del equipo o el equipo no está activo.',
			});
		}

		// Verificar la contraseña (si se proporciona)
		const [user] = await connection.query(
			'SELECT contrasena FROM Alumnos WHERE boleta = ? UNION SELECT contrasena FROM Docentes WHERE clave_empleado = ?',
			[lider, lider]
		);

		if (user.length === 0) {
			return res.status(404).json({
				message: 'No se encontró el usuario para verificar la contraseña.',
			});
		}

		const passwordMatch = await bcrypt.compare(contrasena, user[0].contrasena);

		if (!passwordMatch) {
			return res.status(403).json({
				message: 'Contraseña incorrecta.',
			});
		}

		// Verificar la existencia del área (academia)
		const [academia] = await connection.query(
			'SELECT * FROM Academia WHERE academia = ?',
			[area]
		);

		if (academia.length === 0) {
			return res.status(404).json({
				message: 'El área/academia especificada no existe.',
			});
		}

		// Validar campos vacíos (no hacer cambios si están vacíos)
		const fieldsToUpdate = {};
		if (nombre_equipo) fieldsToUpdate.nombre_equipo = nombre_equipo;
		if (titulo) fieldsToUpdate.titulo = titulo;
		if (director) fieldsToUpdate.director = director;
		if (director_2) fieldsToUpdate.director_2 = director_2;
		if (area) fieldsToUpdate.academia = area;

		// Verificar si el director y director_2 están en la tabla de Docentes
		if (director && !(await isDocenteExist(connection, director))) {
			return res.status(404).json({
				message: `El director ${director} no está registrado en la tabla de Docentes.`,
			});
		}

		// Verificar si el director_2 es el mismo que el director, solo si no están vacíos
		if (director && director_2 && director_2 === director) {
			return res.status(404).json({
				message: `El director ${director} ya es tu primer director.`,
			});
		}

		// Verificar si el director_2 es el mismo mque el director ijnical
		if (director_2 === equipo[0].director) {
			return res.status(404).json({
				message: `El director ${director_2}, no puede ser tu segundo director por que ya es tu primer directo.`,
			});
		}

		if (director_2 && !(await isDocenteExist(connection, director_2))) {
			return res.status(404).json({
				message: `El director ${director_2} no está registrado en la tabla de Docentes.`,
			});
		}

		// Realizar la actualización solo si hay algo que actualizar

		if (Object.keys(fieldsToUpdate).length > 0) {
			await connection.query(
				"UPDATE Equipos SET nombre_equipo = ?, titulo = ?, director = ?, director_2 = ?, academia = ? WHERE nombre_equipo = ? AND lider = ? AND estado = 'A'",
				[
					fieldsToUpdate.nombre_equipo
						? fieldsToUpdate.nombre_equipo.toUpperCase()
						: equipo[0].nombre_equipo,
					fieldsToUpdate.titulo
						? fieldsToUpdate.titulo.toUpperCase()
						: equipo[0].titulo,
					fieldsToUpdate.director || equipo[0].director,
					fieldsToUpdate.director_2 || equipo[0].director_2,
					fieldsToUpdate.academia
						? fieldsToUpdate.academia.toUpperCase()
						: equipo[0].academia,
					nombre_equipo,
					lider,
				]
			);

			// Realizar la actualización de la tabla Docente_Equipos si el nombre del equipo cambia
			if (fieldsToUpdate.nombre_equipo) {
				await connection.query(
					'UPDATE Docente_Equipos SET nombre_equipo = ? WHERE id_equipo = ? AND id_docente = ?',
					[
						fieldsToUpdate.nombre_equipo.toUpperCase(), // Actualizar con el nuevo nombre del equipo
						equipo[0].id_equipo, // Usamos el id_equipo que se recuperó previamente
						lider, // El líder es el docente que hace la actualización
					]
				);

				// Registrar el cambio en la tabla ABC
				const cambioDocenteEquipos = `Se actualizó el nombre del equipo a ${fieldsToUpdate.nombre_equipo.toUpperCase()} para el docente.`;
				await connection.query(
					'INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) VALUES (?, ?, ?, ?)',
					['Docente_Equipos', equipo[0].id_equipo, cambioDocenteEquipos, lider]
				);
			}

			// Registrar el cambio en la tabla ABC
			const cambio = `Se actualizó el equipo ${nombre_equipo}.`;
			await connection.query(
				'INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) VALUES (?, ?, ?, ?)',
				['Equipos', equipo[0].id_equipo, cambio, lider]
			);

			// Responder al cliente con éxito
			return res.status(200).json({
				message: 'El equipo ha sido actualizado correctamente.',
			});
		} else {
			return res.status(200).json({
				message: 'No se realizaron cambios, los datos ya están actualizados.',
			});
		}
	} catch (error) {
		console.error('Error al actualizar el equipo:', error);
		return res.status(500).json({
			message: 'Hubo un error al procesar la solicitud.',
		});
	}
};

// Función para verificar si el docente existe
const isDocenteExist = async (connection, docente) => {
	const [docenteExistente] = await connection.query(
		'SELECT * FROM Docentes WHERE clave_empleado = ?',
		[docente]
	);
	return docenteExistente.length > 0;
};

module.exports = { updateTeam };
