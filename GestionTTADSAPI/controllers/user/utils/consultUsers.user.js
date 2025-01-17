const { request, response } = require('express');
const { getConnection } = require('../../../models/sqlConnection');

const consultUsers = async (req = request, res = response) => {
  const { boleta, clave_empleado, correo, fecha, rolSolicitado, rol } = req.body;
  const { rol: userRole, correo: userCorreo } = req.user || {}; // Extrae usuario autenticado del middleware
  
  if (!rol) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    // Obtener permisos del rol del usuario autenticado
    const pool = await getConnection();
    const [rolePermissions] = await pool.execute(
      'SELECT permisos FROM Permisos WHERE rol = ?',
      [rol]
    );

    if (rolePermissions.length === 0) {
      return res.status(403).json({ message: 'No tienes permisos para consultar usuarios.' });
    }

    const permisos = rolePermissions[0].permisos;
    const puedeConsultarAlumnos = permisos.includes('4');
    const puedeConsultarDocentes = permisos.includes('5');
    const puedeConsultarTodos = permisos.includes('G');
	console.log('Permisos obtenidos:', permisos);


    if (!puedeConsultarAlumnos && !puedeConsultarDocentes && !puedeConsultarTodos) {
      return res.status(403).json({
        message: 'No tienes permisos válidos para consultar usuarios.',
      });
    }

    // Construir consulta según permisos
    let query = '';
    let queryParams = [];
    let filtroAplicado = false;

    if (puedeConsultarAlumnos && boleta) {
      query = `
        SELECT 'Alumno' AS tipo, a.id_equipo, a.id_protocolo, a.boleta, a.nombre, a.correo,
               e.nombre_equipo, p.titulo AS nombre_protocolo, a.estado
        FROM Alumnos a
        LEFT JOIN Equipos e ON a.id_equipo = e.id_equipo
        LEFT JOIN Protocolos p ON a.id_protocolo = p.id_protocolo
        WHERE a.boleta = ?
      `;
      queryParams.push(boleta);
      filtroAplicado = true;
    }

    if (puedeConsultarDocentes && clave_empleado) {
      query = `
        SELECT 'Docente' AS tipo, d.clave_empleado, d.nombre, d.correo, d.estado
        FROM Docentes d;
      `;
      queryParams.push(clave_empleado);
      filtroAplicado = true;
    }

    if (puedeConsultarTodos && !filtroAplicado) {
      query = `
        SELECT 'Alumno' AS tipo, a.id_equipo, a.id_protocolo, a.boleta, a.nombre, a.correo,
               e.nombre_equipo, p.titulo AS nombre_protocolo, a.estado
        FROM Alumnos a
        LEFT JOIN Equipos e ON a.id_equipo = e.id_equipo
        LEFT JOIN Protocolos p ON a.id_protocolo = p.id_protocolo
        UNION ALL
        SELECT 'Docente' AS tipo, NULL AS id_equipo, NULL AS id_protocolo, d.clave_empleado,
               d.nombre, d.correo, NULL AS nombre_equipo, NULL AS nombre_protocolo, d.estado
        FROM Docentes d
      `;
    }

    // Ejecutar consulta
    const [usuarios] = await pool.execute(query, queryParams);

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con los criterios proporcionados.' });
    }

    return res.status(200).json({ usuarios });
  } catch (error) {
    console.error('Error en el servidor:', error.message);
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { consultUsers };
