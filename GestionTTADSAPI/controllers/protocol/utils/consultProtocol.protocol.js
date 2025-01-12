const { request, response } = require("express");
const jwt = require('jsonwebtoken');
const { getConnection } = require("../../../models/sqlConnection");

const consultProtocol = async (req = request, res = response) => {
    const { nombre_equipo, fecha, boleta_lider, titulo_protocolo } = req.body; // Filtros de búsqueda
    const token = req.header("log-token");
    
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // ** Decodificar token para obtener la boleta o clave de usuario**
        const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa'); // Usa el secreto correcto para verificar el token
        const usuarioBoleta = decoded.boleta || decoded.clave_empleado; // Usamos boleta o clave_empleado

        // Verificar que se haya obtenido un identificador válido
        if (!usuarioBoleta) {
            return res.status(400).json({ message: 'No se pudo obtener un identificador válido del token' });
        }

        const { rol: userRole } = decoded; // Obtener el rol del usuario desde el token

        // **2️ Verificar permisos de usuario**
        const pool = await getConnection();
        const [rolePermissions] = await pool.execute('SELECT permisos FROM Permisos WHERE rol = ?', [userRole]);

        if (rolePermissions.length === 0) {
            return res.status(403).json({ message: 'No tienes permisos para consultar protocolos.' });
        }

        const permisos = rolePermissions[0].permisos;
        const puedeConsultarPropioEquipo = permisos.includes('C'); // Permiso para consultar solo su protocolo
        const puedeConsultarTodosProtocolos = permisos.includes('G'); // Permiso para consultar todos los protocolos

        if (!puedeConsultarPropioEquipo && !puedeConsultarTodosProtocolos) {
            return res.status(403).json({ message: 'No tienes permisos para consultar protocolos.' });
        }

        // ** Construcción de la consulta**
        let query = `
        SELECT 
            p.lider,
            p.titulo,
            p.etapa,
            p.academia,
            p.director,
            p.director_2,
            p.sinodal_1,
            p.sinodal_2,
            p.sinodal_3,
            p.calif_Sinodal1,
            p.calif_Sinodal2,
            p.calif_Sinodal3,
            p.estado,
            DATE_FORMAT(p.fecha_registro, '%d/%m/%Y') AS fecha_registro,
            p.estatus,
            p.pdf,
            d.resultado AS dictamen
        FROM Protocolos p
        LEFT JOIN (
            SELECT 
                id_protocolo, 
                MAX(id_dictamen) AS id_dictamen  -- Selecciona el dictamen más reciente
            FROM Dictamen
            GROUP BY id_protocolo
        ) latest_dictamen ON latest_dictamen.id_protocolo = p.id_protocolo
        LEFT JOIN Dictamen d ON d.id_dictamen = latest_dictamen.id_dictamen
        WHERE 1=1
        `;

        const queryParams = [];

        // Si no tiene permiso 'G', solo puede consultar los protocolos donde sea parte
        if (!puedeConsultarTodosProtocolos) {
            query += `
                AND (
                    p.lider = ? OR 
                    p.director = ? OR 
                    p.director_2 = ? OR 
                    p.sinodal_1 = ? OR 
                    p.sinodal_2 = ? OR 
                    p.sinodal_3 = ?
                )
            `;
            // Usamos el identificador del usuario (boleta o clave)
            queryParams.push(usuarioBoleta, usuarioBoleta, usuarioBoleta, usuarioBoleta, usuarioBoleta, usuarioBoleta);
        }

        // **Aplicar los filtros proporcionados**
        if (nombre_equipo) {
            query += " AND p.id_equipo IN (SELECT id_equipo FROM Equipos WHERE nombre_equipo LIKE ?)";
            queryParams.push(`%${nombre_equipo}%`);
        }

        if (fecha) {
            const [anio, mes] = fecha.split('/');
            const fechaInicio = `${2000 + parseInt(anio)}-${mes}-01 00:00:00`;
            const fechaFin = `${2000 + parseInt(anio)}-${mes}-31 23:59:59`;
            query += " AND p.fecha_registro BETWEEN ? AND ?";
            queryParams.push(fechaInicio, fechaFin);
        }

        // Filtro por boleta_lider
        if (boleta_lider) {
            query += " AND p.lider = ?";
            queryParams.push(boleta_lider);
        }

        // Filtro por título de protocolo
        if (titulo_protocolo) {
            query += " AND p.titulo LIKE ?";
            queryParams.push(`%${titulo_protocolo}%`);
        }

        // console.log("Consulta:", query);
        // console.log("Parámetros:", queryParams);

        // ** Ejecutar la consulta**
        const [protocolos] = await pool.execute(query, queryParams);

        // ** Limpiar los datos (eliminar espacios extra)**
        const protocolosLimpios = protocolos.map(protocol => {
            return Object.fromEntries(
                Object.entries(protocol).map(([key, value]) => [
                    key,
                    value && typeof value === 'string' ? value.trim() : value // Solo hace trim si el valor es un string
                ])
            );
        });

        if (protocolosLimpios.length === 0) {
            return res.status(404).json({ message: "No se encontraron protocolos con los criterios proporcionados." });
        }

        // ** Registrar la consulta en la tabla ABC**
        const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
        const changeDescription = `Consulta de protocolos realizada por ${usuarioBoleta} con filtros: ${JSON.stringify(req.body)}`;
        await pool.execute(registerChange, ['Consultas', 0, changeDescription, usuarioBoleta]);

        // **7️⃣ Responder con los protocolos encontrados**
        return res.status(200).json({ protocolos: protocolosLimpios });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { consultProtocol };