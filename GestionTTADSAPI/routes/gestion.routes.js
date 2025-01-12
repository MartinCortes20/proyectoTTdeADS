const { Router } = require('express');

const { assignJudges } = require('../controllers/gestion');

const { validarLogin } = require('../middlewares/validateLogin');
//const{validateAuth} = require ("../middlewares/validateAuth")

const router = Router();

router.post('/asignarSinodales', [validarLogin], assignJudges);

module.exports = router;
