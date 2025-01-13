import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const BASE_URL = 'http://localhost:8080/api/gestionTT';

/**
 * Manejar errores en las solicitudes.
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

/**
 * Decodificar token JWT.
 */
const decodificarToken = (token) => {
	try {
		return jwtDecode(token); // jwtDecode se usa aquí
	} catch (error) {
		console.error('Error al decodificar el token:', error);
		return null;
	}
};


// ** Usuarios **
export const crearEstudiante = async (nombre, correo, contrasena, boleta) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/registroUsuario`, {
			nombre,
			correo,
			contrasena,
			boleta,
		});
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al registrar estudiante.');
	}
};

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
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al registrar maestro.');
	}
};

export const iniciarSesion = async (correo, contrasena) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/inicioSesion`, {
			correo,
			contrasena,
		});
		const usuario = decodificarToken(response.data.token);
		return { success: true, token: response.data.token, usuario };
	} catch (error) {
		return handleRequestError(error, 'Error al iniciar sesión.');
	}
};

export const cerrarSesion = async () => {
	try {
		localStorage.removeItem('log-token');
		return { success: true, message: 'Sesión cerrada exitosamente.' };
	} catch (error) {
		console.error('Error al cerrar sesión:', error.message);
		return { success: false, message: 'Error al cerrar sesión.' };
	}
};

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
		return { success: true, data: response.data.usuarios };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar usuarios.');
	}
};

export const actualizarEstudiante = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarEstudiante`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar estudiante.');
	}
};

export const actualizarDocente = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarDocentes`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar docente.');
	}
};

export const eliminarUsuario = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/darDeBajaUsuario`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar usuario.');
	}
};

// ** Equipos **
export const crearEquipo = async (token, data) => {
	try {
		const response = await axios.post(`${BASE_URL}/usuario/nuevoEquipo`, data, {
			headers: { 'log-token': token },
		});
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al crear equipo.');
	}
};

export const consultarEquipos = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/consultarEquipos`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data.equipos };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar equipos.');
	}
};

export const actualizarEquipo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/actualizarEquipo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar equipo.');
	}
};

export const eliminarEquipo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/darDeBajaEquipo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar equipo.');
	}
};

// ** Protocolos **
export const consultarProtocolos = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/consultarProtocolos`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data.protocolos };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar protocolos.');
	}
};

export const crearProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/crearProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al crear protocolo.');
	}
};

export const actualizarProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/actualizarProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al actualizar protocolo.');
	}
};

export const eliminarProtocolo = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/darDeBajaProtocolo`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al eliminar protocolo.');
	}
};

// ** Calificaciones **
export const consultarCalificaciones = async (token, filtros = {}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/calificaciones/consultarCalificaciones`,
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data.calificaciones };
	} catch (error) {
		return handleRequestError(error, 'Error al consultar calificaciones.');
	}
};

// ** Gestión **
export const asignarSinodales = async (token, data) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/gestion/asignarSinodales`,
			data,
			{
				headers: { 'log-token': token },
			}
		);
		return { success: true, data: response.data };
	} catch (error) {
		return handleRequestError(error, 'Error al asignar sinodales.');
	}
};
