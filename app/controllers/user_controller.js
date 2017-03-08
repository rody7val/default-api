var User = require('../models/user')

// Autoload - factoriza el código si la ruta incluye :userId
exports.load = function(req, res, next, userId) {
	User
	.findOne({_id: userId})
	.exec(function (err, user){
		if (err) return res.status(500).json({
			status: 500,
			error: err,
			err: 'No existe el usuario con _id = '+ userId
		})
		req.user = user;
		next();
	})
}

/**
 * @api {get} /users Obtener Usuarios
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {Object} users Arreglo de todos los usuarios.
 *
 * @apiSuccessExample Respuesta de ejemplo con dos usuarios en la Base de Datos:
 * {
 *     "status": 200,
 *     "users": [{
 *         "_id":"5876c58152788f0a046d3a50",
 *         "email":"rodolfo@gmail.com"
 *     },{
 *         "_id":"5876c58152788f0a046d3c69",
 *         "email":"nicolas@gmail.com"
 *     }]
 *}
 */
exports.count = function (req, res) {
	User.count({})
	.exec(function (err, count) {
		if (err) res.status(500).json({
			status: 500, 
			err: err
		})
		else res.status(200).json({
			status: 200, 
			count: count
		})
	})
}

exports.all = function (req, res) {
	User.find({})
	.exec(function (err, users) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		res.status(200).json({
			status: 200, 
			users: users
		})
	})
}

exports.one = function(req, res){
	res.json({
		status: 200,
		user: req.user
	})
};

exports.active = function(req, res, next){
	req.user.active = true;
	req.user.save(function (err) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		next();
	});
};

exports.block = function(req, res, next){
	req.user.active = false;
	req.user.save(function (err) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		next();
	});
};

exports.delete = function(req, res, next){
	req.user.remove(function (err) {
		if (err) return res.status(500).json({
			status: 500, 
			err: err
		})
		next();
	});
};