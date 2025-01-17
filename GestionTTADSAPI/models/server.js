const express = require('express');
const cors = require('cors');
var path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');


class Server {
	constructor() {
		this.PORT = 8080;
		this.app = express();

		this.rutaAdminRoot = '/api/gestionTT/adminRoot/';
		this.rutaSupervisorRoot = '/api/gestionTT/supervisorRoot';
		this.rutaAuthRoot = '/api/gestionTT/authRoot';

		this.rutaAdmin = '/api/gestionTT/admin/';
		this.rutaSupervisor = '/api/gestionTT/supervisor';
		this.rutaAuth = '/api/gestionTT/auth';

		this.rutaUsuario = '/api/gestionTT/usuario';
		this.rutaProtocolo = '/api/gestionTT/protocolos';
		this.rutaGestion = '/api/gestionTT/gestion';
		this.rutaCatt = '/api/gestionTT/catt';
		this.rutaPage = '/';

		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.static(path.join(__dirname, '../', 'public')));
	}

	routes() {
		this.app.use(this.rutaUsuario, require('../routes/user.routes'));
		this.app.use(this.rutaProtocolo, require('../routes/protocol.routes'));
		this.app.use(this.rutaGestion, require('../routes/gestion.routes'));
		this.app.use(this.rutaCatt, require('../routes/catt.routes'));

		//No more routes FROM HERE
		this.app.use(this.rutaPage, require('../routes/webApp.routes'));
		this.app.set('views', path.join(__dirname, '../', '/public'));
		this.app.engine('html', require('ejs').renderFile);
		this.app.set('view engine', 'html');

		
        this.app.use((req, res) => {
            res.status(404).json({ message: 'Ruta no encontrada.' });
        });
	}

	listen() {
		this.app.listen(this.PORT, () => {
			console.log(`Server running on port ${this.PORT}`);
			console.log("Conexion exitosa ")
		});
	}
}

module.exports = Server;
