const { Router } = require('express');
const { userLogin } = require('../controllers/user');
const { createUser } = require('../controllers/user');
const { consultUsers } = require('../controllers/user');
const { updateStudent } = require('../controllers/user');
const { updateProf } = require('../controllers/user');
const { deleteUser } = require('../controllers/user');

const { newTeam } = require('../controllers/user');
const { consultTeam } = require('../controllers/user');
const { deleteTeam } = require('../controllers/user');
const { updateTeam } = require('../controllers/user');

const { validarLogin } = require('../middlewares/validateLogin');
const { getAcademias } = require('../controllers/user/utils/getAcademias');
// const{validateAuth} = require ("../middlewares/validateAuth")

const router = Router();

router.post('/inicioSesion', userLogin);
router.post('/registroUsuario', createUser);

router.post('/consultarUsuarios', [validarLogin], consultUsers);
router.post('/actualizarEstudiante', [validarLogin], updateStudent);
router.post('/actualizarDocentes', [validarLogin], updateProf);
router.post('/darDeBajaUsuario', [validarLogin], deleteUser);
router.post('/consultarAcademias', getAcademias);

//equipos
router.post('/nuevoEquipo', [validarLogin], newTeam);
router.post('/consultarEquipos', [validarLogin], consultTeam);
router.post('/darDeBajaEquipo', [validarLogin], deleteTeam);
router.post('/actualizarEquipo', [validarLogin], updateTeam);

module.exports = router;
