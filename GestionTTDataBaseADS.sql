-- Crear base de datos
CREATE DATABASE GestionTT;
USE GestionTT;

DROP DATABASE IF EXISTS GestionTT;

-- Tabla Alumnos
CREATE TABLE Alumnos (
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,        -- ID único del alumno
    rol VARCHAR(250) NULL,                           -- Rol asignado al alumno
    id_equipo INT,                                   -- Relación con la tabla de Equipos
    id_protocolo INT,                                -- Relación con la tabla de Protocolos
    nombre VARCHAR(250) UNIQUE NULL,                -- Nombre único del alumno
    correo VARCHAR(250) UNIQUE NOT NULL,            -- Correo único del alumno
    boleta VARCHAR(50),                             -- Boleta del alumno
    estado VARCHAR(2) DEFAULT 'A',                  -- Estado de alta ('A') o baja ('B')
    contrasena VARCHAR(150),                        -- Contraseña hasheada
    nombre_equipo VARCHAR(150),                     -- Nombre del equipo asociado
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de cambio del registro
);

-- Tabla de Docentes
CREATE TABLE Docentes (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,      -- ID único del docente
    rol VARCHAR(250) NULL,                          -- Rol asignado al docente
    academia VARCHAR(150),
    nombre VARCHAR(250) UNIQUE NULL,               -- Nombre único del docente
    correo VARCHAR(250) UNIQUE NOT NULL,           -- Correo único del docente
    clave_empleado VARCHAR(50),                    -- Clave de usuario (en lugar de boleta)
    estado VARCHAR(2) DEFAULT 'A',                 -- Estado de alta ('A') o baja ('B')
    contrasena VARCHAR(150),                       -- Contraseña hasheada
    nombre_equipo VARCHAR(150),                    -- Nombre del equipo asociado
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de cambio del registro
);

-- Tabla Roles
CREATE TABLE Roles (
    rol VARCHAR(250) PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Equipos
CREATE TABLE Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    id_protocolo INT,                               -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL,                   -- Referencia a Usuarios (id_usuario) que es el líder del equipo
    nombre_equipo VARCHAR(150) NOT NULL,
    titulo VARCHAR(255),
    director VARCHAR(100) NOT NULL,                -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL,              -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    academia VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(10) DEFAULT 'A',                -- Nueva columna 'estado'
    fecha_eliminacion DATETIME NULL,
    usuario_eliminacion VARCHAR(255) NULL
);

-- Tabla Docente_Equipos
CREATE TABLE Docente_Equipos (
    id_docente INT NOT NULL,                        -- ID del docente
    id_equipo INT NOT NULL,                         -- ID del equipo
    nombre_equipo VARCHAR(150),
    estatus VARCHAR(10) NOT NULL DEFAULT 'A',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de asignación
    PRIMARY KEY (id_docente, id_equipo),            -- Clave primaria compuesta (evita duplicados)
    FOREIGN KEY (id_docente) REFERENCES Docentes(id_docente) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla Protocolos
CREATE TABLE Protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT,                                  -- Protocolo asociado al equipo
    lider VARCHAR(100) NOT NULL,                   -- Referencia a Usuarios (id_usuario) que es el líder del protocolo
    titulo VARCHAR(255) NOT NULL,
    etapa VARCHAR(100) NOT NULL DEFAULT 'Registro',
    academia VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
    director VARCHAR(100) NOT NULL,                -- Referencia a Usuarios (id_usuario) que es el director
    director_2 VARCHAR(100) NOT NULL,              -- Referencia a Usuarios (id_usuario) que es el director
    sinodal_1 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_2 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    sinodal_3 VARCHAR(100) NOT NULL,               -- Referencia a Usuarios (id_usuario) que es el sinodal
    calif_Sinodal1 VARCHAR(100) NOT NULL DEFAULT 'Pendiente', 
    calif_Sinodal2 VARCHAR(100) NOT NULL DEFAULT 'Pendiente', 
    calif_Sinodal3 VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
    estado VARCHAR(100) NOT NULL DEFAULT 'Registrado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion DATETIME NULL,
    usuario_eliminacion VARCHAR(255) NULL,
    estatus VARCHAR(10) DEFAULT 'A',
    pdf VARCHAR(255) DEFAULT 'EN PROGRESO'
);

-- Tabla Docente_Protocolo
CREATE TABLE Docente_Protocolo (
    id_docente INT NOT NULL,                        -- ID del docente
    id_protocolo INT NOT NULL,                      -- ID del protocolo
    titulo VARCHAR(150) NOT NULL,                   -- Título del protocolo
    estatus VARCHAR(10) NOT NULL DEFAULT 'A',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de asignación
    PRIMARY KEY (id_docente, id_protocolo),         -- Clave primaria compuesta (evita duplicados)
    FOREIGN KEY (id_docente) REFERENCES Docentes(id_docente) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla Permisos
CREATE TABLE Permisos (
    rol VARCHAR(100),
    permisos VARCHAR(10) NOT NULL,                 -- Descripción de los permisos asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Etapas
CREATE TABLE Etapas (
    id_etapa VARCHAR(100),
    etapas VARCHAR(150) NOT NULL,                  -- Descripción de los etapas asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla EstadoRevision
CREATE TABLE EstadoRevision (
    id_estado VARCHAR(100),
    estados VARCHAR(150) NOT NULL,                 -- Descripción de los estados asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Academia
CREATE TABLE Academia (
    id_academia VARCHAR(100),
    academia VARCHAR(150) NOT NULL,                -- Descripción de los estados asignados
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para registrar cambios
CREATE TABLE ABC (
    id_cambio INT AUTO_INCREMENT PRIMARY KEY,      -- ID del cambio
    tabla_afectada VARCHAR(100) NOT NULL,          -- Tabla donde se hizo el cambio (Ej: Usuarios, Equipos, Protocolos)
    id_registro INT NOT NULL,                      -- ID del registro afectado
    cambio_realizado TEXT NOT NULL,                -- Descripción del cambio realizado
    usuario VARCHAR(100) NOT NULL,                 -- Nombre del usuario que hizo el cambio
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha y hora del cambio
);

-- Tabla Evaluacion
CREATE TABLE Evaluacion (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,  -- ID único para la evaluación
    id_protocolo INT NOT NULL,                     -- Relación con la tabla Protocolos
    id_equipo INT NOT NULL,                        -- Relación con la tabla Equipos
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de la evaluación
    sinodal VARCHAR(100) NOT NULL,                 -- Nombre del primer sinodal
    titulo_corresponde_producto ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 1
    observaciones_1 TEXT,                          -- Observaciones de la pregunta 1
    resumen_claro ENUM('SI', 'NO') DEFAULT 'NO',   -- Respuesta para la pregunta 2
    observaciones_2 TEXT,                          -- Observaciones de la pregunta 2
    palabras_clave_adecuadas ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 3
    observaciones_3 TEXT,                          -- Observaciones de la pregunta 3
    problema_comprensible ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 4
    observaciones_4 TEXT,                          -- Observaciones de la pregunta 4
    objetivo_preciso_relevante ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 5
    observaciones_5 TEXT,                          -- Observaciones de la pregunta 5
    planteamiento_claro ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 6
    observaciones_6 TEXT,                          -- Observaciones de la pregunta 6
    contribuciones_justificadas ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 7
    observaciones_7 TEXT,                          -- Observaciones de la pregunta 7
    viabilidad_adecuada ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 8
    observaciones_8 TEXT,                          -- Observaciones de la pregunta 8
    propuesta_metodologica_pertinente ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 9
    observaciones_9 TEXT,                          -- Observaciones de la pregunta 9
    calendario_adecuado ENUM('SI', 'NO') DEFAULT 'NO', -- Respuesta para la pregunta 10
    observaciones_10 TEXT,                         -- Observaciones de la pregunta 10
    aprobado ENUM('SI', 'NO') DEFAULT 'NO',        -- Si fue aprobado el protocolo
    recomendaciones_adicionales TEXT,             -- Recomendaciones generales de la evaluación
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla Dictamen
CREATE TABLE Dictamen (
    id_dictamen INT AUTO_INCREMENT PRIMARY KEY,    -- ID único para el dictamen
    id_protocolo INT NOT NULL,                     -- Relación con la tabla Protocolos
    id_equipo INT NOT NULL,                        -- Relación con la tabla Equipos
    resultado ENUM('APROBADO', 'NO APROBADO', 'EN REVISIÓN') DEFAULT 'EN REVISIÓN', -- Resultado general
    fecha_dictamen TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del dictamen
    FOREIGN KEY (id_protocolo) REFERENCES Protocolos(id_protocolo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
);
