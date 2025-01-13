import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://localhost:8080/api/gestionTT';

/**
 * Manejar errores en las solicitudes.
 * @param {Object} error - Objeto de error de Axios.
 * @param {string} defaultMessage - Mensaje de error por defecto.
 * @returns {Object} Respuesta de error.
 */
const handleRequestError = (error, defaultMessage) => {
	if (error.response) {
		console.error(
			`Error en la solicitud: ${error.response.status} - ${error.response.data.message}`
		);
		return {
			success: false,
			message: error.response.data.message || defaultMessage,
			status: error.response.status,
		};
	} else if (error.request) {
		console.error('No se recibió respuesta del servidor:', error.request);
		return {
			success: false,
			message: 'No se recibió respuesta del servidor.',
			status: 500,
		};
	} else {
		console.error('Error al configurar la solicitud:', error.message);
		return {
			success: false,
			message: 'Error al configurar la solicitud.',
			status: 500,
		};
	}
};

// Usuarios
/**
 * Decodificar token JWT.
 * @param {string} token - Token JWT.
 * @returns {Object} Información del usuario.
 */
const decodificarToken = (token) => {
	try {
		return jwtDecode(token);
	} catch (error) {
		console.error('Error al decodificar el token:', error);
		return null;
	}
};

/**
 * Crear un estudiante.
 * @param {string} nombre - Nombre del estudiante.
 * @param {string} correo - Correo del estudiante.
 * @param {string} contrasena - Contraseña del estudiante.
 * @param {string} boleta - Boleta del estudiante.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const crearEstudiante = async (nombre, correo, contrasena, boleta) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/registroUsuario`, {
			nombre,
			correo,
			contrasena,
			boleta,
		});
		console.log('Estudiante creado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al registrar estudiante.');
	}
};

/**
 * Crear un maestro.
 * @param {string} nombre - Nombre del maestro.
 * @param {string} correo - Correo del maestro.
 * @param {string} contrasena - Contraseña del maestro.
 * @param {string} clave_empleado - Clave del empleado.
 * @param {string} funcion - Rol del maestro.
 * @param {string} academia - Academia a la que pertenece.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const crearMaestro = async (
	nombre,
	correo,
	contrasena,
	clave_empleado,
	funcion,
	academia
) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/registroUsuario`, {
			nombre,
			correo,
			contrasena,
			clave_empleado,
			rol: funcion,
			academia,
		});
		console.log('Maestro creado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al registrar maestro.');
	}
};

/**
 * Iniciar sesión.
 * @param {string} correo - Correo del usuario.
 * @param {string} contrasena - Contraseña del usuario.
 * @returns {Promise<Object>} Token de autenticación y datos del usuario.
 */
export const iniciarSesion = async (correo, contrasena) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/inicioSesion`, {
			correo,
			contrasena,
		});
		// console.log('Token recibido:', response.data.token);

		// Decodificar el token para obtener información del usuario
		const usuario = decodificarToken(response.data.token);
		// console.log('Información del usuario:', usuario);

		return { success: true, token: response.data.token, usuario };
	} catch (error) {
		return handleRequestError(error, 'Error al iniciar sesión.');
	}
};

/**
 * Cerrar sesión.
 * @returns {Promise<Object>} Mensaje de confirmación.
 */
export const cerrarSesion = async () => {
	try {
		localStorage.removeItem('log-token');
		console.log('Sesión cerrada exitosamente.');
		return { success: true, message: 'Sesión cerrada exitosamente.' };
	} catch (error) {
		console.error('Error al cerrar sesión:', error.message);
		return { success: false, message: 'Error al cerrar sesión.' };
	}
};

/**
 * Consultar usuarios con filtros opcionales.
 * @param {string} token - Token de autenticación.
 * @param {Object} filtros - Filtros de búsqueda (opcional).
 * @returns {Promise<Object>} Lista de usuarios.
 */
export const consultarUsuarios = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/consultarUsuarios`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Usuarios encontrados:', response.data);

		// // Decodificar token para extraer información adicional si es necesario
		// const usuarioAutenticado = decodificarToken(token);
		// console.log('Usuario autenticado:', usuarioAutenticado);

		return { success: true, data: response.data.usuarios };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar usuarios.');
	}
};

/**
 * Actualizar un estudiante.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del estudiante a actualizar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarEstudiante = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarEstudiante`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Estudiante actualizado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar estudiante.');
	}
};

/**
 * Actualizar un docente.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del docente a actualizar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarDocente = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarDocentes`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Docente actualizado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar docente.');
	}
};

/**
 * Eliminar un usuario.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del usuario a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const eliminarUsuario = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/darDeBajaUsuario`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Usuario eliminado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar usuario.');
	}
};

// Equipos
/**
 * Crear un equipo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del equipo a crear.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const crearEquipo = async (token, data) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/nuevoEquipo`, data, {
			headers: { 'log-token': token },
		});
		console.log('Equipo creado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al crear equipo.');
	}
};

/**
 * Consultar equipos registrados.
 * @param {string} token - Token de autenticación.
 * @param {Object} filtros - Filtros opcionales.
 * @returns {Promise<Object>} Lista de equipos.
 */
export const consultarEquipos = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/consultarEquipos`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Equipos encontrados:', response.data);
		return { success: true, data: response.data.equipos };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar equipos.');
	}
};

/**
 * Actualizar un equipo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del equipo a actualizar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarEquipo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarEquipo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Equipo actualizado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar equipo.');
	}
};

/**
 * Eliminar un equipo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del equipo a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const eliminarEquipo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/darDeBajaEquipo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Equipo eliminado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar equipo.');
	}
};

// Protocolos
/**
 * Consultar protocolos registrados.
 * @param {string} token - Token de autenticación.
 * @param {Object} filtros - Filtros opcionales.
 * @returns {Promise<Object>} Lista de protocolos.
 */
export const consultarProtocolos = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/consultarProtocolos`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Protocolos encontrados:', response.data);
		return { success: true, data: response.data.protocolos };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar protocolos.');
	}
};

/**
 * Crear un protocolo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del protocolo a crear.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const crearProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/crearProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Protocolo creado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al crear protocolo.');
	}
};

/**
 * Actualizar un protocolo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del protocolo a actualizar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/actualizarProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Protocolo actualizado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar protocolo.');
	}
};

/**
 * Eliminar un protocolo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del protocolo a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const eliminarProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/darDeBajaProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Protocolo eliminado:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar protocolo.');
	}
};

/**
 * Subir un PDF para un protocolo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del protocolo y archivo PDF.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const subirPDF = async (token, data) => {
	try {
		const response = await axios.post(`${BASE_URL}/protocolos/subirPDF`, data, {
			headers: { 'log-token': token },
		});
		console.log('PDF subido:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al subir PDF.');
	}
};

// Gestión
/**
 * Asignar sinodales a un protocolo.
 * @param {string} token - Token de autenticación.
 * @param {Object} data - Datos del protocolo y sinodales.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const asignarSinodales = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/gestion/asignarSinodales`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		console.log('Sinodales asignados:', response.data);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al asignar sinodales.');
	}
};
