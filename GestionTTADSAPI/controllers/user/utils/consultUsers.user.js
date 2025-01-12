const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection');

const consultUsers = async (req = request, res = response) => {
	const { rol, fecha, boleta, correo, clave_empleado } = req.body; // Filtros de consulta
	const { rol: userRole, correo: userCorreo } = req; // Rol y correo del usuario autenticado
	console.log('correo;', userCorreo);
	try {
		// Verificar permisos de usuario
		const pool = await getConnection();
		const [rolePermissions] = await pool.execute(
			'SELECT permisos FROM Permisos WHERE rol = ?',
			[userRole]
		);

		if (rolePermissions.length === 0) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para consultar usuarios.' });
		}

		const permisos = rolePermissions[0].permisos;

		// Verificar si tiene permiso para consultar alumnos (4), docentes (5) o todos (G)
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
				.json({ message: 'No tienes permisos para consultar usuarios.' });
		}

		// Crear la consulta para buscar en Alumnos y Docentes
		let query = `
            SELECT 'Alumno' AS tipo, a.boleta, a.nombre, a.correo, e.nombre_equipo, p.titulo AS nombre_protocolo, a.estado
            FROM Alumnos a 
            LEFT JOIN Equipos e ON a.id_equipo = e.id_equipo 
            LEFT JOIN Protocolos p ON a.id_protocolo = p.id_protocolo
            WHERE 1=1
        `;

		if (!puedeConsultarTodos) {
			query += ' AND (a.correo = ? OR e.lider = ?)';
		}

		const queryParams = [userCorreo, userCorreo];

		if (rol) {
			query += ' AND a.rol = ?';
			queryParams.push(rol.toUpperCase());
		}
		if (boleta) {
			query += ' AND a.boleta = ?';
			queryParams.push(boleta);
		}
		if (correo) {
			query += ' AND a.correo = ?';
			queryParams.push(correo);
		}
		if (fecha) {
			const [anio, mes] = fecha.split('/');
			const fechaInicio = `${2000 + parseInt(anio)}-${mes}-01 00:00:00`;
			const fechaFin = `${2000 + parseInt(anio)}-${mes}-31 23:59:59`;
			query += ' AND a.fecha_registro BETWEEN ? AND ?';
			queryParams.push(fechaInicio, fechaFin);
		}

		console.log('query:', query);
		let queryDocentes = `
             SELECT 
            'Docente' AS tipo, 
            d.clave_empleado, 
            d.nombre, 
            d.correo, 
            e.nombre_equipo, 
            p.titulo AS nombre_protocolo, 
            d.estado 
        FROM Docente_Protocolo_Equipos dpe 
        JOIN Docentes d ON dpe.id_docente = d.id_docente 
        JOIN Protocolos p ON dpe.id_protocolo = p.id_protocolo 
        JOIN Equipos e ON dpe.id_equipo = e.id_equipo 
        WHERE 1=1
        `;

		if (!puedeConsultarTodos) {
			queryDocentes += ' AND (d.correo = ? OR e.lider = ?)';
		}

		const queryDocentesParams = [userCorreo, userCorreo];

		if (rol) {
			queryDocentes += ' AND d.rol = ?';
			queryDocentesParams.push(rol.toUpperCase());
		}
		if (clave_empleado) {
			queryDocentes += ' AND d.clave_empleado = ?';
			queryDocentesParams.push(clave_empleado);
		}
		if (correo) {
			queryDocentes += ' AND d.correo = ?';
			queryDocentesParams.push(correo);
		}

		const [alumnos] = await pool.execute(query, queryParams);
		console.log('Alumnos: ', alumnos);
		const [docentes] = await pool.execute(queryDocentes, queryDocentesParams);

		const usuarios = alumnos.concat(docentes).map((user) => {
			return Object.fromEntries(
				Object.entries(user).map(([key, value]) => [
					key,
					value ? value.trim() : value,
				])
			);
		});

		if (usuarios.length === 0) {
			return res.status(404).json({
				message: 'No se encontraron usuarios con los criterios proporcionados.',
			});
		}

		// Registrar la consulta en la tabla ABC
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
		// console.log(usuarios);
		return res.status(200).json({ usuarios });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
	}
};

module.exports = { consultUsers };
