const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection');

const consultUsers = async (req = request, res = response) => {
	let { boleta, clave_empleado, correo, fecha, rolSolicitado, rol } = req.body; // Filtros de consulta
	const { rol: userRole, correo: userCorreo } = req; // Rol y correo del usuario autenticado
	
	try {
		// Verificar permisos del usuario autenticado
		const pool = await getConnection();
		const [rolePermissions] = await pool.execute(
			'SELECT permisos FROM Permisos',
			[rol]
		);
		console.log(rolePermissions);
		
		if (rolePermissions.length === 0) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para consultar usuarios.' });
		}

		const permisos = rolePermissions[0].permisos; // Cadena de permisos, ej: "45G"
		const puedeConsultarAlumnos = permisos.includes('4');
		const puedeConsultarDocentes = permisos.includes('5');
		const puedeConsultarTodos = permisos.includes('G');

		if (
			!puedeConsultarAlumnos &&
			!puedeConsultarDocentes &&
			!puedeConsultarTodos
		) {
			return res
				.status(403)
				.json({
					message: 'No tienes permisos válidos para consultar usuarios.',
				});
		}

		let query = '';
		let queryParams = [];

		// Construir consulta según los permisos
		if (puedeConsultarAlumnos && boleta) {
			console.log('Permiso 4 detectado. Consultando alumnos por boleta...');
			query = `
                SELECT 'Alumno' AS tipo, a.boleta, a.nombre, a.correo, e.nombre_equipo, p.titulo AS nombre_protocolo, a.estado
                FROM Alumnos a 
                LEFT JOIN Equipos e ON a.id_equipo = e.id_equipo 
                LEFT JOIN Protocolos p ON a.id_protocolo = p.id_protocolo
                WHERE a.boleta = ?
            `;
			queryParams.push(boleta);
		} else if (puedeConsultarDocentes) {
			console.log(
				'Permiso 5 detectado. Consultando docentes por clave_empleado...'
			);
			query = `
                SELECT 'Docente' AS tipo, d.id_docente, d.clave_empleado, d.nombre, d.correo, de.nombre_equipo, dp.titulo AS nombre_protocolo, d.estado
                FROM Docentes d
                LEFT JOIN Docente_Equipos de ON d.id_docente = de.id_docente
                LEFT JOIN Equipos e ON de.id_equipo = e.id_equipo
                LEFT JOIN Docente_Protocolo dp ON d.id_docente = dp.id_docente
            `;
		} else if (puedeConsultarTodos) {
			console.log('Permiso G detectado. Consultando alumnos y docentes...');

			query = `
                SELECT 'Alumno' AS tipo, 
                       u.nombre AS nombre_usuario, 
                       u.correo AS correo_usuario, 
                       u.boleta AS identificador, 
                       e.nombre_equipo AS equipo_asociado, 
                       p.titulo AS protocolo_asociado,
                       u.estado, 
                    DATE_FORMAT(u.fecha_registro, '%d/%m/%Y') AS fecha_registro
                FROM Alumnos u
                LEFT JOIN Equipos e ON u.id_equipo = e.id_equipo
                LEFT JOIN Protocolos p ON u.id_protocolo = p.id_protocolo
                WHERE 1=1
            `;

			if (rolSolicitado) {
				query += ' AND u.rol = ?';
				console.log(rolSolicitado);
				rolSolicitado = rolSolicitado.toUpperCase();
				queryParams.push(rolSolicitado);
			}
			if (boleta) {
				query += ' AND u.boleta = ?';
				queryParams.push(boleta);
			}
			if (correo) {
				query += ' AND u.correo = ?';
				queryParams.push(correo);
			}
			if (fecha) {
				const [anio, mes] = fecha.split('/');
				const fechaInicio = `${2000 + parseInt(anio)}-${mes}-01 00:00:00`;
				const fechaFin = `${2000 + parseInt(anio)}-${mes}-31 23:59:59`;
				query += ' AND u.fecha_registro BETWEEN ? AND ?';
				queryParams.push(fechaInicio, fechaFin);
			}

			query += `
                UNION ALL
                SELECT 'Docente' AS tipo, 
                d.nombre AS nombre_usuario, 
                d.correo AS correo_usuario, 
                d.clave_empleado AS identificador, 
                de.nombre_equipo AS equipo_asociado, 
                dp.titulo AS protocolo_asociado, 
                d.estado, 
                DATE_FORMAT(d.fecha_registro, '%d/%m/%Y') AS fecha_registro
            FROM Docentes d
            LEFT JOIN Docente_Equipos de ON de.id_docente = d.id_docente AND de.estatus = 'A'
            LEFT JOIN Docente_Protocolo dp ON dp.id_docente = d.id_docente AND dp.estatus = 'A'
            WHERE 1=1
            `;
			if (rolSolicitado) {
				query += ' AND d.rol = ?';
				rolSolicitado = rolSolicitado.toUpperCase();
				queryParams.push(rolSolicitado);
			}
			if (clave_empleado) {
				query += ' AND d.clave_empleado = ?';
				queryParams.push(clave_empleado);
			}
			if (correo) {
				query += ' AND d.correo = ?';
				queryParams.push(correo);
			}
			if (fecha) {
				const [anio, mes] = fecha.split('/');
				const fechaInicio = `${2000 + parseInt(anio)}-${mes}-01 00:00:00`;
				const fechaFin = `${2000 + parseInt(anio)}-${mes}-31 23:59:59`;
				query += ' AND d.fecha_registro BETWEEN ? AND ?';
				queryParams.push(fechaInicio, fechaFin);
			}
		} else {
			return res
				.status(400)
				.json({
					message:
						'No se detectaron parámetros válidos para tu consulta, recuerda que solo puedes bucar por boleta o clave de empleado.',
				});
		}

		// Ejecutar consulta
		const [usuarios] = await pool.execute(query, queryParams);

		if (usuarios.length === 0) {
			return res.status(404).json({
				message: 'No se encontraron usuarios con los criterios proporcionados.',
			});
		}

		// Registrar consulta en el historial
		const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
		const changeDescription = `Consulta de usuarios realizada por ${userCorreo}`;
		await pool.execute(registerChange, [
			'Consultas',
			0,
			changeDescription,
			userCorreo,
		]);

		return res.status(200).json({ usuarios });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
	}
};

module.exports = { consultUsers };
