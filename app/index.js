// Dependencias y modulos
require('dotenv').config();
var config = require('../config'),
	express = require('express'),
	db = require('mongoose'),
	cors = require('cors'),
	favicon = require('serve-favicon'),
	bodyParser = require('body-parser'),
	logger = require('morgan');

// Instancia de nueva aplicación y rutas API
var app = express(),
	api = require('../app/routes')(express);

// Conexión a la base de datos
db.connect(config.db, function (err) {
	if (err) return console.error(err);
	console.log('Conectado a la Base de Datos');
});

// Configuraciones del servidor
app.use(cors());
app.use(express.static(config.raiz+'/app/public'));
app.use(favicon(config.raiz+'/app/public/img/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(api);

// Retornar aplicación.
module.exports = app;