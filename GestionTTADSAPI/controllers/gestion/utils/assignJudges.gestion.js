const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");

const assignJudges = async (req = request, res = response) => {
    try {
        const { equipo, titulo_protocolo } = req.body;

        if (!equipo || !titulo_protocolo) {
            return res.status(400).json({ message: "Faltan datos en el cuerpo de la solicitud." });
        }

        const equipoUpper = equipo.toUpperCase();
        const tituloProtocoloUpper = titulo_protocolo.toUpperCase();

        const token = req.header("log-token");
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autorización." });
        }

        const decodedToken = jwt.verify(token, 'cLaaVe_SecReeTTa');
        const { rol ,clave_empleado,boleta} = decodedToken;


        const connection = await getConnection();
        const [permiso] = await connection.query(
            `SELECT permisos FROM Permisos WHERE rol = ?`, [rol]
        );

        if (!permiso.length || !permiso[0].permisos.includes('G')) {
            return res.status(403).json({ message: "No tienes permiso para asignar sinodales." });
        }

        const [protocolo] = await connection.query(
            `SELECT p.*, e.id_equipo 
             FROM Protocolos p
             JOIN Equipos e ON e.id_protocolo = p.id_protocolo 
             WHERE UPPER(e.nombre_equipo) = ? 
               AND UPPER(p.titulo) = ? 
               AND p.estatus = 'A'`, 
            [equipoUpper, tituloProtocoloUpper]
        );

        if (!protocolo.length) {
            return res.status(404).json({ message: "No se encontró un protocolo con ese equipo y título en estatus 'A'." });
        }

        const protocoloId = protocolo[0].id_protocolo;
        const idEquipo = protocolo[0].id_equipo;
        const academiaProtocolo = protocolo[0].academia;

         // 🛑 Verificar si los sinodales ya están asignados
         const { sinodal_1, sinodal_2, sinodal_3 } = protocolo[0];
         if (sinodal_1 !== 'POR DEFINIR' || sinodal_2 !== 'POR DEFINIR' || sinodal_3 !== 'POR DEFINIR') {
             return res.status(409).json({ message: "Ya se agregaron sinodales a este protocolo." });
         }

          // Obtener los directores del protocolo (director y director_2)
        const director1 = protocolo[0].director;
        const director2 = protocolo[0].director_2;

        let [sinodalesDisponibles] = await connection.query(
            `SELECT id_docente, clave_empleado, nombre, correo, academia 
             FROM Docentes 
             WHERE UPPER(academia) = ? 
             AND estado = 'A'
             AND (SELECT COUNT(*) FROM Docente_Protocolo WHERE Docente_Protocolo.id_docente = Docentes.id_docente AND Docente_Protocolo.estatus = 'A') < 5`, 
            [academiaProtocolo]
        );

        // Excluir los directores de la lista de sinodales disponibles
        sinodalesDisponibles = sinodalesDisponibles.filter(sinodal => 
            sinodal.clave_empleado !== director1 && sinodal.clave_empleado !== director2
        );

        if (sinodalesDisponibles.length >= 3) {
            sinodalesAsignados = sinodalesDisponibles.slice(0, 3);
        } else {
            const [sinodalesExtra] = await connection.query(
                `SELECT id_docente, clave_empleado, nombre, correo 
                 FROM Docentes 
                 WHERE estado = 'A' 
                 AND (SELECT COUNT(*) FROM Docente_Protocolo WHERE Docente_Protocolo.id_docente = Docentes.id_docente AND Docente_Protocolo.estatus = 'A') < 5 
                 AND rol IN ('SINODAL')`
            );

            const totalSinodales = [...sinodalesDisponibles, ...sinodalesExtra];
            if (totalSinodales.length < 3) {
                return res.status(409).json({ message: "No hay suficientes sinodales disponibles para asignar 3 al protocolo." });
            }
            
            sinodalesAsignados = totalSinodales.slice(0, 3);
        }

        //  Evitar asignar directores como sinodales
        sinodalesAsignados = sinodalesAsignados.filter(sinodal => 
            sinodal.id_docente !== director1 && sinodal.id_docente !== director2
        );

        if (sinodalesAsignados.length < 3) {
            return res.status(409).json({ message: "No hay suficientes sinodales disponibles que no sean directores." });
        }

        const [sinodal1, sinodal2, sinodal3] = sinodalesAsignados.map(sinodal => sinodal.clave_empleado);

        await connection.query(
            `UPDATE Protocolos 
             SET sinodal_1 = ?, sinodal_2 = ?, sinodal_3 = ? 
             WHERE id_protocolo = ?`, 
            [sinodal1, sinodal2, sinodal3, protocoloId]
        );

        await Promise.all(sinodalesAsignados.map(async (sinodal) => {
            try {
                const [docente] = await connection.query(
                    `SELECT id_docente FROM Docentes WHERE clave_empleado = ?`, 
                    [sinodal.clave_empleado]
                );

                const idDocente = docente.length ? docente[0].id_docente : null;

                if (!idDocente) {
                    console.error(`No se encontró un id_docente para la clave_empleado: ${sinodal.clave_empleado}`);
                    return;
                }

                await connection.query(
                    `INSERT INTO Docente_Protocolo (id_protocolo, id_docente, titulo) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE id_protocolo = VALUES(id_protocolo)`, 
                    [protocoloId, idDocente, tituloProtocoloUpper]
                );

                 // Insertar también en la tabla Docente_Equipos
                 await connection.query(
                    `INSERT INTO Docente_Equipos (id_docente, id_equipo, nombre_equipo)
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE id_equipo = VALUES(id_equipo)`,
                    [idDocente, idEquipo, equipoUpper]
                );

            } catch (error) {
                console.error(`Error asignando sinodal: ${error.message}`);
            }

        }));

         // Registrar el cambio en la tabla ABC
         await connection.query(
            `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
             VALUES (?, ?, ?, ?)`,
            ['Protocolos', protocoloId, 'Asignación de sinodales', clave_empleado || boleta]
        );



        res.status(200).json({ 
            message: "Sinodales asignados con éxito.", 
            protocolo: {
                id: protocoloId,
                titulo: tituloProtocoloUpper,
                equipo: equipoUpper
            },
            sinodales: {
                sinodal_1: sinodal1,
                sinodal_2: sinodal2,
                sinodal_3: sinodal3
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al asignar los sinodales." });
    }
};

module.exports = { assignJudges };