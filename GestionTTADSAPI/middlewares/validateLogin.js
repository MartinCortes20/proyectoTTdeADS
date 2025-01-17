const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const validarLogin = (req = request, res = response, next) => {
	// Suponiendo que el token se envía en el encabezado 'log-token'

	const token = req.header('log-token');	
	if (!token) {
		return res.status(401).json({ message: 'Inicia sesion porfavor.' });
	}

	try {
		const payload = jwt.verify(token, process.env.SECRETKEY);
		if (payload.tokenType !== 'log-token') {
			return res.status(401).json({
				message:
					'Hubo un problema al ingresar a tu cuenta, porfavor vuelve a ingresar.',
			});
		}

		req.id_usuario = payload.id_usuario;
		req.nombre = payload.nombre;
		req.correo = payload.correo;
		req.rol = payload.rol;

		next();
	} catch (err) {
		// console.error(err);
		return res
			.status(401)
			.json({ message: 'Tu sesion ha expirado, vuelve a iniciar sesion.' });
	}
};

module.exports = { validarLogin };
