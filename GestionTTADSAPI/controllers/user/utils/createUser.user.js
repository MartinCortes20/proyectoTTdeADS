const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection'); // Conexión con la base de datos MySQL
const bcrypt = require('bcryptjs'); // Usamos bcrypt para hashear contraseñas

// Función para registrar un usuario
const createUser = async (req = request, res = response) => {
	const { correo, contrasena, boleta, nombre, clave_empleado, rol, academia } =
		req.body;
	const { rol: userRole, nombre: userName } = req; // El rol del usuario que hace la petición, que viene del token

	try {
		// Validar si se envían los campos obligatorios
		let missingFields = [];
		if (!nombre) missingFields.push('nombre');
		if (!correo) missingFields.push('correo');
		if (!contrasena) missingFields.push('contrasena');

		// Verificar si boleta o clave_empleado están presentes
		if (!boleta && !clave_empleado) {
			missingFields.push('boleta o clave_empleado'); // Al menos uno debe estar presente
		}

		if (missingFields.length > 0) {
			return res
				.status(400)
				.json({
					message: `Faltan los siguientes campos: ${missingFields.join(', ')}`,
				});
		}

		// Si se ingresó boleta, el registro es para "Alumnos"
		if (boleta) {
			return await createAlumno(req, res, nombre, correo, contrasena, boleta);
		}

		// Si se ingresó clave_empleado y rol, el registro es para "Docentes"
		else if (clave_empleado && rol) {
			return await createDocente(
				req,
				res,
				nombre,
				correo,
				contrasena,
				clave_empleado,
				rol,
				academia
			);
		}

		// Si no se cumple ninguna de las condiciones, retornamos un error
		return res
			.status(400)
			.json({
				message:
					'Debe proporcionar boleta para Alumno o clave_empleado y rol para Docente',
			});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
	}
};

// Función para registrar un Alumno
const createAlumno = async (req, res, nombre, correo, contrasena, boleta) => {
	try {
		const pool = await getConnection();

		// Convertir todos los valores a string y sanitizar entrada
		const nombreStr = String(nombre || '')
			.trim()
			.toUpperCase();
		const correoStr = String(correo || '').trim();
		const contrasenaStr = String(contrasena || '').trim();
		const boletaStr = String(boleta || '').trim();

		// Validaciones
		if (boletaStr.length !== 10 || isNaN(boletaStr)) {
			return res
				.status(400)
				.json({ message: 'La boleta debe ser un número de 10 dígitos' });
		}

		// Verificar si el correo o boleta ya existen
		const checkExistenceQuery = `
        SELECT 'ALUMNO' AS tipo, id_alumno, nombre, correo, boleta 
        FROM Alumnos 
        WHERE nombre = ? OR correo = ? OR boleta = ?
        
        UNION 

        SELECT 'DOCENTE' AS tipo, id_docente, nombre, correo, clave_empleado 
        FROM Docentes 
        WHERE nombre = ? OR correo = ?
        
        `;
		const [existingUser] = await pool.execute(checkExistenceQuery, [
			nombreStr,
			correoStr,
			boletaStr,
			nombreStr,
			correoStr,
		]);

		if (existingUser.length > 0) {
			let mensajes = [];
			for (const record of existingUser) {
				if (record.tipo === 'DOCENTE') {
					if (record.nombre === nombreStr)
						mensajes.push('El nombre ya existe en la tabla de Docentes.');
					if (record.correo === correoStr)
						mensajes.push('El correo ya existe en la tabla de Docentes.');
				} else if (record.tipo === 'ALUMNO') {
					if (record.nombre === nombreStr)
						mensajes.push('El nombre ya existe en la tabla de Alumnos.');
					if (record.correo === correoStr)
						mensajes.push('El correo ya existe en la tabla de Alumnos.');
					if (record.boleta === boletaStr)
						mensajes.push('La boleta ya existe en la tabla de Alumnos.');
				}
			}
			return res.status(400).json({ message: mensajes.join(' ') });
		}

		// Hashear la contraseña
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(contrasenaStr, saltRounds);

		// Insertar en la tabla Alumnos
		const insertQuery = `
            INSERT INTO Alumnos (nombre, correo, contrasena, boleta, rol, nombre_equipo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
		const [result] = await pool.execute(insertQuery, [
			nombreStr,
			correoStr,
			hashedPassword,
			boletaStr,
			'ESTUDIANTE',
			'POR DEFINIR',
		]);

		// Obtener el ID del usuario recién insertado
		const newUserId = result.insertId;

		// Registrar el cambio en la tabla ABC
		const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
		const changeDescription = `Usuario creado: ${nombreStr} con boleta: ${boletaStr}`;
		const usuarioStr = String(req.body.nombre || '')
			.trim()
			.toUpperCase(); // Convertir a mayúsculas
		await pool.execute(registerChange, [
			'Alumnos',
			newUserId,
			changeDescription,
			usuarioStr,
		]);

		// Respuesta exitosa
		return res.status(201).json({ message: 'Alumno registrado correctamente' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
	}
};

// Función para registrar un Docente
const createDocente = async (
	req,
	res,
	nombre,
	correo,
	contrasena,
	clave_empleado,
	rol,
	academia
) => {
	try {
		const pool = await getConnection();

		// Convertir todos los valores a string y sanitizar entrada
		const nombreStr = String(nombre || '')
			.trim()
			.toUpperCase();
		const correoStr = String(correo || '').trim();
		const contrasenaStr = String(contrasena || '').trim();
		const claveEmpleadoStr = String(clave_empleado || '').trim();
		const rolStr = String(rol || '')
			.trim()
			.toUpperCase();
		const academiaStr = String(academia || '')
			.trim()
			.toUpperCase();

		// Validación de roles en la tabla Roles
		const [roles] = await pool.execute('SELECT * FROM Roles WHERE rol = ?', [
			rolStr,
		]);
		if (roles.length === 0) {
			return res.status(400).json({
				message: `El rol ingresado ${rolStr} no existe en la tabla Roles. Asegúrese de usar un rol válido.`,
			});
		}
		console.log(academia);

		// Verificar si la academia ingresada existe en la tabla Academia
		const [academiaExists] = await pool.execute(
			'SELECT * FROM Academia WHERE UPPER(academia) = ?',
			[academiaStr]
		);
		if (academiaExists.length === 0) {
			return res
				.status(400)
				.json({
					message: `La academia ingresada '${academiaStr}' no existe en la tabla de Academias.`,
				});
		}

		// Verificar si el correo, nombre o clave_empleado ya existen en Docentes o Alumnos
		const checkExistenceQuery = `
            SELECT 'DOCENTE' AS tipo, id_docente, nombre, correo, clave_empleado 
            FROM Docentes 
            WHERE nombre = ? OR correo = ? OR clave_empleado = ? 
            
            UNION 
            
            SELECT 'ALUMNO' AS tipo, id_alumno, nombre, correo, boleta 
            FROM Alumnos 
            WHERE nombre = ? OR correo = ?
        `;
		const [existingUser] = await pool.execute(checkExistenceQuery, [
			nombreStr,
			correoStr,
			claveEmpleadoStr,
			nombreStr,
			correoStr,
		]);

		if (existingUser.length > 0) {
			let mensajes = [];
			for (const record of existingUser) {
				if (record.tipo === 'DOCENTE') {
					if (record.nombre === nombreStr)
						mensajes.push('El nombre ya existe en la tabla de Docentes.');
					if (record.correo === correoStr)
						mensajes.push('El correo ya existe en la tabla de Docentes.');
					if (record.clave_empleado === claveEmpleadoStr)
						mensajes.push(
							'La clave_empleado ya existe en la tabla de Docentes.'
						);
				} else if (record.tipo === 'ALUMNO') {
					if (record.nombre === nombreStr)
						mensajes.push('El nombre ya existe en la tabla de Alumnos.');
					if (record.correo === correoStr)
						mensajes.push('El correo ya existe en la tabla de Alumnos.');
				}
			}
			return res.status(400).json({ message: mensajes.join(' ') });
		}

		// Hashear la contraseña
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(contrasenaStr, saltRounds);

		// Insertar en la tabla Docentes
		const insertQuery = `
            INSERT INTO Docentes (nombre, correo, contrasena, clave_empleado, rol, academia)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
		const [result] = await pool.execute(insertQuery, [
			nombreStr,
			correoStr,
			hashedPassword,
			claveEmpleadoStr,
			rolStr,
			academiaStr,
		]);

		// Obtener el ID del usuario recién insertado
		const newUserId = result.insertId;

		// Registrar el cambio en la tabla ABC
		const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
		const changeDescription = `Docente creado: ${nombreStr} con clave_empleado: ${claveEmpleadoStr}`;
		const usuarioStr = String(req.body.nombre || '')
			.trim()
			.toUpperCase(); // Convertir a mayúsculas
		await pool.execute(registerChange, [
			'Docentes',
			newUserId,
			changeDescription,
			usuarioStr,
		]);

		// Respuesta exitosa
		return res
			.status(201)
			.json({ message: 'Docente registrado correctamente' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
	}
};

module.exports = { createUser };
