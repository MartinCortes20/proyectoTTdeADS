const { request, response } = require('express');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jwt
const { getConnection } = require('../../../../models/sqlConnection');

const consultTeam = async (req = request, res = response) => {
	const { nombre_equipo, fecha, boleta_lider, titulo_protocolo } = req.body; // Filtros de búsqueda
	const token = req.header('log-token');

	if (!token) {
		return res.status(401).json({ message: 'Token no proporcionado' });
	}

	try {
		// **1️⃣ Decodificar token para obtener la boleta o clave de usuario**
		const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa'); // Usa el secreto correcto para verificar el token
		const usuarioBoleta = decoded.boleta || decoded.clave_empleado; // Usamos boleta o clave_empleado

		// Verificar que se haya obtenido un identificador válido
		if (!usuarioBoleta) {
			return res.status(400).json({
				message: 'No se pudo obtener un identificador válido del token',
			});
		}

		const { rol: userRole } = decoded; // Obtener el rol del usuario desde el token

		// **2️⃣ Verificar permisos de usuario**
		const pool = await getConnection();
		const [rolePermissions] = await pool.execute(
			'SELECT permisos FROM Permisos WHERE rol = ?',
			[userRole]
		);

		if (rolePermissions.length === 0) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para consultar equipos.' });
		}

		const permisos = rolePermissions[0].permisos;
		const puedeConsultarPropioEquipo = permisos.includes('7'); // Permiso para consultar solo su equipo
		const puedeConsultarTodosEquipos = permisos.includes('G'); // Permiso para consultar todos los equipos

		if (!puedeConsultarPropioEquipo && !puedeConsultarTodosEquipos) {
			return res
				.status(403)
				.json({ message: 'No tienes permisos para consultar equipos.' });
		}

		// **3️⃣ Construcción de la consulta**
		let query = `
            SELECT 
                e.nombre_equipo, 
                e.titulo, 
                e.lider, 
                e.director, 
                e.director_2, 
                e.sinodal_1, 
                e.sinodal_2, 
                e.sinodal_3, 
                e.academia, 
                DATE_FORMAT(e.fecha_registro, '%d/%m/%Y') AS fecha_registro,
                e.estado
            FROM Equipos e 
            WHERE 1=1
        `;

		const queryParams = [];

		// Si no tiene permiso 'G', solo puede consultar los equipos donde sea parte
		if (!puedeConsultarTodosEquipos) {
			query += `
                AND (
                    e.lider = ? OR 
                    e.director = ? OR 
                    e.director_2 = ? OR 
                    e.sinodal_1 = ? OR 
                    e.sinodal_2 = ? OR 
                    e.sinodal_3 = ?
                )
            `;
			// Usamos el identificador del usuario (boleta o clave)
			queryParams.push(
				usuarioBoleta,
				usuarioBoleta,
				usuarioBoleta,
				usuarioBoleta,
				usuarioBoleta,
				usuarioBoleta
			);
		}

		// **Aplicar los filtros proporcionados**
		if (nombre_equipo) {
			query += ' AND e.nombre_equipo LIKE ?';
			queryParams.push(`%${nombre_equipo}%`);
		}

		if (fecha) {
			const [anio, mes] = fecha.split('/');
			const fechaInicio = `${2000 + parseInt(anio)}-${mes}-01 00:00:00`;
			const fechaFin = `${2000 + parseInt(anio)}-${mes}-31 23:59:59`;
			query += ' AND e.fecha_registro BETWEEN ? AND ?';
			console.log(queryParams);
			queryParams.push(fechaInicio, fechaFin);
		}

		// Filtro por boleta_lider
		if (boleta_lider) {
			query += ' AND e.lider = ?';
			queryParams.push(boleta_lider);
		}

		// Filtro por título de protocolo
		if (titulo_protocolo) {
			query += ' AND e.titulo LIKE ?';
			console.log(queryParams);
			queryParams.push(titulo_protocolo);
		}


		// **4️⃣ Ejecutar la consulta**
		const [equipos] = await pool.execute(query, queryParams);

		// **5️⃣ Limpiar los datos (eliminar espacios extra)**
		const equiposLimpios = equipos.map((team) => {
			return Object.fromEntries(
				Object.entries(team).map(([key, value]) => [
					key,
					value && typeof value === 'string' ? value.trim() : value, // Solo hace trim si el valor es un string
				])
			);
		});

		if (equiposLimpios.length === 0) {
			return res.status(404).json({
				message: 'No se encontraron equipos con los criterios proporcionados.',
			});
		}

		// **6️⃣ Registrar la consulta en la tabla ABC**
		const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
		const changeDescription = `Consulta de equipos realizada por ${usuarioBoleta} con filtros: ${JSON.stringify(
			req.body
		)}`;
		await pool.execute(registerChange, [
			'Consultas',
			0,
			changeDescription,
			usuarioBoleta,
		]);

		// **7️⃣ Responder con los equipos encontrados**
		return res.status(200).json({ equipos: equiposLimpios });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
	}
};

module.exports = { consultTeam };
