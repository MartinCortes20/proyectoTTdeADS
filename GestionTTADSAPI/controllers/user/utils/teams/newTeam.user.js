const { request, response } = require('express');
const { getConnection } = require('../../../../models/sqlConnection');
const jwt = require('jsonwebtoken');

const newTeam = async (req = request, res = response) => {
	const connection = await getConnection();
	const token = req.header('log-token');

	if (!token) {
		return res.status(401).json({ message: 'Por favor, inicie sesión' });
	}

	try {
		console.log('Datos recibidos:', req.body);
		const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
		const usuarioBoleta = decoded.boleta || decoded.clave_empleado;
		console.log('Usuario autenticado:', usuarioBoleta);

		const [permisos] = await connection.query(
			'SELECT permisos FROM Permisos WHERE rol = (SELECT rol FROM Alumnos WHERE boleta = ? UNION SELECT rol FROM Docentes WHERE clave_empleado = ?)',
			[usuarioBoleta, usuarioBoleta]
		);

		if (!permisos.length) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para realizar esta acción' });
		}

		const permisosUsuario = permisos[0].permisos;

		console.log(permisosUsuario);

		if (!permisosUsuario.includes('6') && !permisosUsuario.includes('G')) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para crear equipos' });
		}

		const {
			nombre_equipo,
			titulo,
			director,
			director_2 = 'NO TIENE',
			academia,
			integrantes_boletas,
			lider,
		} = req.body;

		if (
			typeof nombre_equipo !== 'string' ||
			typeof titulo !== 'string' ||
			typeof academia !== 'string'
		) {
			return res.status(400).json({
				message:
					'Los campos nombre_equipo, titulo y academia deben ser strings',
			});
		}

		const nombreEquipo = nombre_equipo.toUpperCase();
		const tituloEquipo = titulo.toUpperCase();
		const academiaEquipo = academia.toUpperCase();

		// 🛑 **Validación: Verificar que no exista un equipo con el mismo nombre_equipo**
		const [equipoConMismoNombre] = await connection.query(
			"SELECT * FROM Equipos WHERE UPPER(nombre_equipo) = ? AND estado = 'A'",
			[nombreEquipo]
		);
		if (equipoConMismoNombre.length > 0) {
			return res.status(400).json({
				message: `Ya existe un equipo con el nombre '${nombreEquipo}'`,
			});
		}

		// 🛑 **Validación: Verificar que no exista un equipo con el mismo título**
		const [equipoConMismoTitulo] = await connection.query(
			"SELECT * FROM Equipos WHERE UPPER(titulo) = ? AND estado = 'A'",
			[tituloEquipo]
		);
		if (equipoConMismoTitulo.length > 0) {
			return res.status(400).json({
				message: `Ya existe un equipo con el título '${tituloEquipo}'`,
			});
		}

		const [academiaExistente] = await connection.query(
			'SELECT * FROM Academia WHERE academia = ?',
			[academiaEquipo]
		);

		if (!academiaExistente.length) {
			return res
				.status(400)
				.json({ message: 'La academia ingresada no existe' });
		}

		const placeholders = integrantes_boletas.map(() => '?').join(',');
		const [alumnos] = await connection.query(
			`SELECT boleta, estado, id_equipo FROM Alumnos WHERE boleta IN (${placeholders})`,
			integrantes_boletas
		);

		if (alumnos.length !== integrantes_boletas.length) {
			return res
				.status(400)
				.json({ message: 'Algunos estudiantes no existen' });
		}

		const alumnosNoActivos = alumnos.filter((alumno) => alumno.estado !== 'A');
		if (alumnosNoActivos.length > 0) {
			return res
				.status(400)
				.json({ message: 'Algunos estudiantes no están dados de alta' });
		}

		const alumnosConEquipo = alumnos.filter(
			(alumno) => alumno.id_equipo !== null
		);
		if (alumnosConEquipo.length > 0) {
			return res
				.status(400)
				.json({ message: 'Algunos estudiantes ya están en un equipo' });
		}

		const [directores] = await connection.query(
			'SELECT clave_empleado, rol FROM Docentes WHERE clave_empleado IN (?, ?)',
			[director, director_2]
		);

		if (!directores.length) {
			return res
				.status(400)
				.json({ message: 'El director o director_2 no existen' });
		}

		for (const director of directores) {
			if (director.rol === 'ESTUDIANTE') {
				return res
					.status(400)
					.json({ message: 'Un director no puede tener rol de estudiante' });
			}
		}

		if (permisosUsuario.includes('6')) {
			const [usuario] = await connection.query(
				'SELECT rol FROM Alumnos WHERE boleta = ?',
				[usuarioBoleta]
			);

			if (permisosUsuario.includes('G')) {
				console.log(
					"Permiso 'G' detectado, permitiendo creación de equipo sin restricción de pertenencia."
				);
			} else if (usuario.length === 0 || usuario[0].rol !== 'ESTUDIANTE') {
				return res.status(403).json({
					message: "Solo los estudiantes pueden crear equipos con permiso '6'",
				});
			} else if (
				!integrantes_boletas.includes(usuarioBoleta) &&
				lider !== usuarioBoleta
			) {
				return res.status(403).json({
					message: 'No puedes crear un equipo si no eres parte de él',
				});
			}
		}

		const [resultadoEquipo] = await connection.query(
			`INSERT INTO Equipos (lider, nombre_equipo, titulo, director, director_2, academia) 
       VALUES (?, ?, ?, ?, ?, ?)`,
			[lider, nombreEquipo, tituloEquipo, director, director_2, academiaEquipo]
		);

		const idEquipo = resultadoEquipo.insertId;

		await connection.query(
			`
        INSERT INTO Docente_Equipos (id_docente, id_equipo, nombre_equipo) 
      SELECT d.id_docente, ?, e.nombre_equipo
      FROM Docentes d
      JOIN Equipos e ON e.id_equipo = ?
      WHERE d.clave_empleado IN (?, ?)
      ON DUPLICATE KEY UPDATE 
        id_equipo = VALUES(id_equipo), 
        fecha_asignacion = CURRENT_TIMESTAMP
      `,
			[idEquipo, idEquipo, idEquipo, director, director_2]
		);

		for (const boleta of integrantes_boletas) {
			await connection.query(
				'UPDATE Alumnos SET id_equipo = ?, nombre_equipo = ? WHERE boleta = ?',
				[idEquipo, nombreEquipo, boleta]
			);
		}

		await connection.query(
			`INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
       VALUES (?, ?, ?, ?)`,
			['Equipos', idEquipo, 'Creación de equipo ' + nombreEquipo, usuarioBoleta]
		);

		res.status(201).json({
			success: true,
			message: 'Equipo creado con éxito',
			equipo: {
				id_equipo: idEquipo,
				nombre_equipo: nombreEquipo,
				titulo: tituloEquipo,
				director,
				director_2,
				academia: academiaEquipo,
				integrantes: integrantes_boletas,
			},
		});
		console.log('Respuesta enviada al cliente:', {
			id_equipo: idEquipo,
			nombre_equipo: nombreEquipo,
		});
	} catch (error) {
		console.error(
			'Error en la creación del equipo:',
			error.message,
			error.stack
		);
		res.status(500).json({ message: 'Error interno del servidor.' });
	} finally {
		if (connection) connection.release();
	}
};

module.exports = {
	newTeam,
};
