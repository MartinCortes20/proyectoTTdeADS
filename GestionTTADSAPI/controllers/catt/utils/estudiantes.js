const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");

const consultBasicUsers = async (req = request, res = response) => {
    try {
        const pool = await getConnection();

        if (!pool) {
            return res.status(500).json({
                success: false,
                message: 'Error al conectarse a la base de datos.',
            });
        }

        const query = `
            SELECT 
                a.boleta, 
                a.nombre AS nombre_alumno, 
                a.correo,
                a.rol
            FROM 
                Alumnos a
        `;

        const [usuarios] = await pool.execute(query);

        return res.status(200).json({
            success: true,
            message: usuarios.length > 0 ? 'Usuarios obtenidos con éxito.' : 'No se encontraron usuarios.',
            usuarios: usuarios || [],
        });
    } catch (error) {
        console.error('Error en la consulta de usuarios básicos:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Error en el servidor. Intenta de nuevo más tarde.',
            error: error.message,
        });
    }
};




const consultProfes = async (req = request, res = response) => {
    try {
        const pool = await getConnection();

        if (!pool) {
            return res.status(500).json({
                success: false,
                message: 'Error al conectarse a la base de datos.',
            });
        }

        const query = `
            SELECT  
                a.nombre AS nombre_profe, 
                a.correo,
                a.clave_empleado
            FROM 
                docentes a
        `;

        const [usuarios] = await pool.execute(query);

        return res.status(200).json({
            success: true,
            message: usuarios.length > 0 ? 'Usuarios obtenidos con éxito.' : 'No se encontraron usuarios.',
            usuarios: usuarios || [],
        });
    } catch (error) {
        console.error('Error en la consulta de usuarios básicos:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Error en el servidor. Intenta de nuevo más tarde.',
            error: error.message,
        });
    }
};

const eliminarDocente = async (req = request, res = response) => {
    try {
        const { clave_empleado } = req.body; // Se obtiene la clave del docente desde los parámetros de la ruta.

        if (!clave_empleado) {
            return res.status(400).json({
                success: false,
                message: 'La clave del empleado es requerida para eliminar el docente.',
            });
        }

        const pool = await getConnection();

        if (!pool) {
            return res.status(500).json({
                success: false,
                message: 'Error al conectarse a la base de datos.',
            });
        }

        // Consulta para eliminar al docente con la clave específica.
        const query = `
            DELETE FROM docentes
            WHERE clave_empleado = ?;
        `;

        const [result] = await pool.execute(query, [clave_empleado]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró un docente con la clave proporcionada.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Docente eliminado con éxito.',
        });
    } catch (error) {
        console.error('Error al eliminar el docente:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Error en el servidor. Intenta de nuevo más tarde.',
            error: error.message,
        });
    }
};



const eliminarAlumno = async (req = request, res = response) => {
    try {
        const boleta = req.body.id; // Se obtiene la clave del docente desde los parámetros de la ruta.

        if (!boleta) {
            return res.status(400).json({
                success: false,
                message: 'La clave del empleado es requerida para eliminar el docente.',
            });
        }

        const pool = await getConnection();

        if (!pool) {
            return res.status(500).json({
                success: false,
                message: 'Error al conectarse a la base de datos.',
            });
        }

        // Consulta para eliminar al docente con la clave específica.
        const query = `
            DELETE FROM alumnos
            WHERE boleta = ?;
        `;

        const [result] = await pool.execute(query, [boleta]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró un docente con la clave proporcionada.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Docente eliminado con éxito.',
        });
    } catch (error) {
        console.error('Error al eliminar el docente:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Error en el servidor. Intenta de nuevo más tarde.',
            error: error.message,
        });
    }
};



module.exports = { consultBasicUsers , consultProfes,  eliminarDocente, eliminarAlumno};
