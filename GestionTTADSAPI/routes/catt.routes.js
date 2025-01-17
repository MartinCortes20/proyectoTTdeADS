const { Router } = require('express');
const { consultBasicUsers } = require('../controllers/catt');
const { validarLogin } = require('../middlewares/validateLogin');
const { consultProfes, eliminarAlumno } = require('../controllers/catt/utils/estudiantes');

const router = Router();

router.post('/consultarUsuarios', [validarLogin], (req, res) => {
    consultBasicUsers(req, res);
});


router.post('/consultarDocentes', [validarLogin], (req, res) => { 
    consultProfes(req, res);
});

router.post('/eliminarDocente', [validarLogin], (req, res) => { 
    consultProfes(req, res);
});

router.post('/eliminarAlumno', [validarLogin], (req, res) => { 
    eliminarAlumno(req, res);
});
module.exports = router;
