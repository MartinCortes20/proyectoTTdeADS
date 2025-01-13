const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection'); // Conexión con la base de datos MySQL
const jwt = require('jsonwebtoken');

const createProtocol = async (req = request, res = response) => {
	const connection = await getConnection();
	const token = req.header('log-token');

	if (!token) {
		return res.status(401).json({ message: 'Por favor, inicie sesión.' });
	}

	try {
		// Decodificar el token para obtener la boleta o clave del usuario
		const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
		const usuarioBoleta = decoded.boleta || decoded.clave_empleado;

		// Verificar permisos del usuario desde la tabla Permisos
		const [permisos] = await connection.query(
			'SELECT permisos FROM Permisos WHERE rol = (SELECT rol FROM Alumnos WHERE boleta = ? UNION SELECT rol FROM Docentes WHERE clave_empleado = ?)',
			[usuarioBoleta, usuarioBoleta]
		);

		if (!permisos.length) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para realizar esta acción.' });
		}

		const permisosUsuario = permisos[0].permisos;

		// Verificar si el usuario tiene el permiso 'A' o 'G' para crear protocolos
		if (!permisosUsuario.includes('A') && !permisosUsuario.includes('G')) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para crear un protocolo.' });
		}

		let { lider_equipo, titulo_protocolo, academia } = req.body;

		// Validar los parámetros necesarios
		if (typeof titulo_protocolo !== 'string' || typeof academia !== 'string') {
			return res
				.status(400)
				.json({
					message:
						'El título del protocolo y la academia deben ser cadenas de texto.',
				});
		}

		const academiaUpper = academia.toUpperCase();
		titulo_protocolo = titulo_protocolo.toUpperCase();

		// Verificar que la academia exista
		const [academiaExistente] = await connection.query(
			'SELECT * FROM Academia WHERE academia = ?',
			[academiaUpper]
		);

		if (!academiaExistente.length) {
			return res
				.status(400)
				.json({ message: 'La academia ingresada no existe.' });
		}

		// Verificar si el equipo con el líder existe y está activo
		const [equipo] = await connection.query(
			"SELECT * FROM Equipos WHERE lider = ? AND estado = 'A'",
			[lider_equipo]
		);

		if (!equipo.length) {
			return res
				.status(404)
				.json({
					message:
						'El lider que ingresaste no se encuentra en un equipo activo.',
				});
		}

		// Si el usuario tiene permiso 'G', no es necesario ser parte del equipo
		if (permisosUsuario.includes('G')) {
			console.log("Permiso 'G' detectado, permitiendo creación del protocolo.");
		}
		// Si el usuario tiene permiso 'A', verificar si es el líder del equipo
		else if (permisosUsuario.includes('A')) {
			if (equipo[0].lider !== usuarioBoleta) {
				return res
					.status(403)
					.json({
						message:
							'No eres el líder del equipo, no puedes crear el protocolo.',
					});
			}
		}

		// Verificar si ya existe un protocolo con un título similar
		const [protocolosExistentes] = await connection.query(
			`SELECT * FROM Protocolos WHERE MATCH(titulo) AGAINST (? IN NATURAL LANGUAGE MODE) AND estatus = 'A'`,
			[titulo_protocolo]
		);

		if (protocolosExistentes.length > 0) {
			return res.status(400).json({
				message:
					'Ya existe un protocolo con un título similar. No se puede crear el protocolo.',
			});
		}

		// Verificar si ya existe un protocolo con el mismo equipo, líder o título
		const [protocolosExactos] = await connection.query(
			`SELECT * FROM Protocolos WHERE id_equipo = ? AND lider = ? AND titulo = ? AND estatus = 'A'`,
			[equipo[0].id_equipo, lider_equipo, titulo_protocolo]
		);

		if (protocolosExactos.length > 0) {
			return res.status(400).json({
				message:
					'Ya existe un protocolo con el mismo equipo, líder o título. No se puede crear el protocolo.',
			});
		}

		// Crear el protocolo en la base de datos
		const [resultadoProtocolo] = await connection.query(
			`INSERT INTO Protocolos (id_equipo, lider, titulo, academia, director, director_2, sinodal_1, sinodal_2, sinodal_3) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				equipo[0].id_equipo,
				lider_equipo,
				titulo_protocolo,
				academiaUpper,
				equipo[0].director,
				equipo[0].director_2,
				equipo[0].sinodal_1,
				equipo[0].sinodal_2,
				equipo[0].sinodal_3,
			]
		);

		const idProtocolo = resultadoProtocolo.insertId;

		const idDirector = equipo[0].director;
		const idDirector2 = equipo[0].director_2;

		// Actualizar id_protocolo en la tabla Equipos
		await connection.query(
			`UPDATE Equipos SET id_protocolo = ? WHERE lider = ?`,
			[idProtocolo, lider_equipo]
		);

		// Actualizar id_protocolo en la tabla Alumnos para todos los alumnos del equipo del líder, incluyendo al líder mismo
		await connection.query(
			`UPDATE Alumnos 
         SET id_protocolo = ? 
         WHERE id_equipo = ?`,
			[idProtocolo, equipo[0].id_equipo]
		);

		// Obtener los ID de los docentes (directores) que están en el equipo
		const [directores] = await connection.query(
			`SELECT id_docente 
       FROM Docentes 
       WHERE clave_empleado IN (?, ?)`,
			[equipo[0].director, equipo[0].director_2]
		);

		// Insertar en Docente_Protocolo para cada director
		for (const director of directores) {
			if (director.id_docente) {
				await connection.query(
					`INSERT INTO Docente_Protocolo (id_docente, id_protocolo, titulo, estatus) 
           VALUES (?, ?, ?, ?)`,
					[director.id_docente, idProtocolo, titulo_protocolo, 'A']
				);
			}
		}

		// Registrar cambio en la tabla ABC
		await connection.query(
			`INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
         VALUES (?, ?, ?, ?)`,
			[
				'Protocolos',
				idProtocolo,
				'Creación del protocolo ' + titulo_protocolo,
				usuarioBoleta,
			]
		);

		// Responder al cliente con éxito
		res.status(201).json({
			message: 'Protocolo creado con éxito',
			protocolo: {
				id_protocolo: idProtocolo,
				titulo_protocolo,
				academia: academiaUpper,
				lider_equipo,
				director: equipo[0].director,
				director_2: equipo[0].director_2,
				sinodal_1: equipo[0].sinodal_1,
				sinodal_2: equipo[0].sinodal_2,
				sinodal_3: equipo[0].sinodal_3,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error interno del servidor' });
	} finally {
		if (connection) connection.release();
	}
};

module.exports = { createProtocol };
