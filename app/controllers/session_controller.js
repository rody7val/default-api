var jwt = require('jwt-simple') 
var moment = require('moment')
var config = require('../../config')

exports.ensureAuthenticated = function(req, res, next) {  
	if(!req.headers.authorization) {
		return res
			.status(403)
			.json({status: 403, err: "El token ha expirado! Vuelve a iniciar sesión."})
	}

	var token = req.headers.authorization.split(" ")[1]
	var payload = jwt.decode(token, config.TOKEN_SECRET)

	if(payload.exp <= moment().unix()) {
		return res
			.status(401)
			.json({status: 401, message: "El token ha expirado"})
	}

	req.user = payload.sub
	next()
}