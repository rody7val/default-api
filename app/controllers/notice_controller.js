var Notice = require('../models/notice')

// Autoload - factoriza el código si la ruta incluye :noticeId
exports.load = function(req, res, next, noticeId) {
	Notice
	.findOne({_id: noticeId})
	.exec(function (err, notice){
		if (err) return res.status(500).json({
			status: 500,
			error: err,
			err: 'No existe la noticia con _id = '+ noticeId
		})
		req.notice = notice;
		next();
	})
}

/**
 * @api {get} /notice/:noticeId Obtener una Noticia
 * @apiGroup Notices
 * @apiVersion 0.1.0
 *
 * @apiParam {String} noticeId Identificador de la noticia.
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {Object} notices Objeto instancia de la noticia.
 *
 * @apiSuccessExample Respuesta de ejemplo:
 * {
 *     "status": 200,
 *     "notice": {
 *         "title": "Incentivando el tenis",
 *         "content": "Próximamente la nueva cancha de tenis del club tendrá profesor. En breves ...",
 *         "category": "DEPORTES",
 *         "status": false,
 *         "url_img": "https://i.imgur.com/WiaAYKn.gif",
 *         "_id": "58730624f210341390a79fd4",
 *         "created": "2017-01-19T02:31:13.000Z"
 *     }
 *}
 *
 * @apiError {Number} status Código de estado HTTP.
 * @apiError {String} err Información del error.
 *
 * @apiErrorExample Respuesta de ejemplo de error al obtener una noticia.
 * {
 *     "status": 500,
 *     "err": "No existe la noticia con _id = 58730624f210341391a79fd4"
 * }
 *
 */
exports.one = function(req, res){
	res.json({
		status: 200,
		notice: req.notice
	})
};

/**
 * @api {get} /notices Obtener Noticias
 * @apiGroup Notices
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {Object} notices Arreglo de todas las noticia.
 *
 * @apiSuccessExample Respuesta de ejemplo con dos noticias en la Base de Datos:
 * {
 *     "status": 200,
 *     "notices": [{
 *         "title": "Incentivando el tenis",
 *         "content": "Próximamente la nueva cancha de tenis del club tendrá profesor. En breves ...",
 *         "category": "DEPORTES",
 *         "status": false,
 *         "url_img": "https://i.imgur.com/WiaAYKn.gif",
 *         "_id": "58730624f210341390a79fd4",
 *         "created": "2017-01-19T02:31:13.000Z"
 *     },{
 *         "title": "Campeonato de Bochas",
 *         "content": "El trío de bochas del Club Atlético Huracán de Chillar está participando del ...",
 *         "category": "DEPORTES",
 *         "status": true,
 *         "url_img": "https://i.imgur.com/WiaAYKn.gif",
 *         "_id": "58730624f210341390a79fd5",
 *         "created": "2017-01-09T02:31:13.000Z"
 *     }]
 *}
 */
exports.all = function (req, res) {
	Notice.find({})
	.exec(function (err, notices) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		res.status(200).json({
			status: 200, 
			notices: notices
		})
	})
}
/**
 * @api {post} /notices Crear Noticia
 * @apiGroup Notices
 * @apiVersion 0.1.0
 *
 * @apiParam {String} title Titulo de la noticia.
 * @apiParam {String} content Contenido pricipal.
 * @apiParam {String} category Categoria asociada.
 * @apiParam {Boolean} status Estado de moderación.
 * @apiParam {String} url_img Dirección de la imagen.
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {Object} notice Instancia de la noticia creada.
 *
 * @apiSuccessExample Respuesta de ejemplo al crear una noticia en la Base de Datos:
 * {
 *     "status": 200,
 *     "notice": {
 *         "title": "Incentivando el tenis",
 *         "content": "Próximamente la nueva cancha de tenis del club tendrá profesor. En breves ...",
 *         "category": "DEPORTES",
 *         "status": false,
 *         "url_img": "https://i.imgur.com/WiaAYKn.gif",
 *         "_id": "58730624f210341390a79fd4",
 *         "created": "2017-01-19T02:31:13.000Z"
 *     }
 * }
 */
exports.create = function (req, res) {
	var notice = new Notice(req.body.notice)
	
	notice
	.save(function (err, notice) {
		if (err) return res.status(500).json({
			status: 500,
			err: err
		})
		res.status(200).json({
			status: 200,
			notice: notice
		})
	})
}

exports.delete = function(req, res, next){
	req.notice.remove(function (err) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		next();
	});
};