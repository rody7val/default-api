var mongoose = require('mongoose')
var User = require('../models/user')
var service = require('../service')

/**
 * @api {post} /auth/signup Crear Usuario
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {String} email Email del usuario a registrar.
 * @apiParam {String} password Contraseña elegida por el usuario.
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {String} token Firma cifrada que permite identificar un usuario.
 *
 * @apiSuccessExample Respuesta de ejemplo de exito al crear un usuario.
 * {
 *     "status": 200,
 *     "token": "eyJ0eXAiOiJKV1GUzI1NXAiOiJXAiOiJiJ9.eyJzdWIXAiOiJiOiGMTUyNzg4ZXAiOiJjBhMDQ..."
 * }
 *
 * @apiError {Number} status Código de estado HTTP.
 * @apiError {String} err Información del error.
 *
 * @apiErrorExample Respuesta de ejemplo de error al crear un usuario.
 * {
 *     "status": 500,
 *     "err": "El 'Email' es incorrecto."
 * }
 *
 */
exports.emailSignup = function(req, res) {

    var user = new User({
        name: req.body.name || '',
        email: req.body.email || '',
        password: req.body.password || '',
        admin: req.body.admin,
        active: req.body.active
    })

    user.save(function (err, user){
        if (err) return res.status(500).json({
            status: 500, 
            err: err.errors
        })
        res.status(200).json({
            status: 200,
            token: service.createToken(user),
            user: user
        })
    })
}

/**
 * @api {post} /auth/login Iniciar Sesión
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {String} email Email del usuario registrado.
 * @apiParam {String} password Contraseña del usuario registrado.
 *
 * @apiSuccess {Number} status Código de estado HTTP.
 * @apiSuccess {String} token Firma cifrada que permite identificar un usuario.
 *
 * @apiSuccessExample Respuesta de ejemplo de exito al iniciar sesión.
 * {
 *     "status": 200,
 *     "token": "eyJ0eXAiOiJKV1GUzI1NXAiOiJXAiOiJiJ9.eyJzdWIXAiOiJiOiGMTUyNzg4ZXAiOiJjBhMDQ..."
 * }
 *
 * @apiError {Number} status Código de estado HTTP.
 * @apiError {String} err Información del error.
 *
 * @apiErrorExample Respuesta de ejemplo de error al iniciar sesión.
 * {
 *     "status": 500,
 *     "err": "Email incorrecto"
 * }
 *
 */
exports.emailLogin = function(req, res) {
    var email = req.body.email || ''
    var password = req.body.password || ''

    User.findOne({email: email}, function (err, user){
        if (err) {// Error con la base de datos
            res.status(500).json({
                status: 500, 
                err: err
            })
        }
        else if (!user) {// Email incorrecto
            res.status(401).json({
                status: 401, 
                err: "Email incorrecto"
            })
        }
        else if (user.comparePassword(password, user.password)) {// Acceso al token
            res.status(200).json({
                status: 200,
                token: service.createToken(user),
                user: user
            })
        }
        else {// Contraseña incorrecta
            res.status(401).json({
                status: 401, 
                err: 'Contraseña incorrecta'
            })
        }
    })
}

/**
 *
 * Recuperar contraseña
 *
 */
exports.forgot = function(req, res) {

    var options = {
        host: req.body.host || 'http://localhost:3000',
        name: req.body.name || 'MySite',
        email_to: req.body.email,
        email_from: req.body.email_from || null
    };

    User.findOne({email: options.email_to}, function (err, user){
        // Error con la base de datos
        if (err) return res.status(500).json({
            status: 500, 
            err: err
        })
        // Email incorrecto
        else if (!user) return res.status(401).json({
            status: 401, 
            err: "Email incorrecto"
        });
        // Recuperar contraseña
        var crypto = require('crypto');
        crypto.randomBytes(20, function (err, buf) {
            options.token = buf.toString('hex');
            user.resetPasswordToken = options.token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
            user.save(function (err, user) {
                // Enviar email forgot
                var webMail = service.createWebMail("FORGOT", options);
                webMail.sendMail(function (error, info) {
                    if (error) return res.status(500).json({
                        status: 500, 
                        err: "Error de conección con el WebMail. Inténtalo mas tarde.",
                        error: error
                    });
                    // Success!!
                    res.status(200).json({
                        status: 200,
                        info: info,
                        message: "Se ha enviado un e-mail a "+ user.email +" con instrucciones adicionales."
                    });
                });
            });
        });
    });
}

/**
 *
 * Pase a formulario de Restablecer contraseña
 *
 */
exports.reset_isNotExpired = function(req, res) {
    User.findOne({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }, function (err, user) {
        if (!user) return res.status(401).json({
            status: 401,
            success: false,
            err: 'El token de restablecimiento de contraseña no es válido o ha caducado.'
        });
        res.status(200).json({
            status: 200,
            success: true
        });
    });
}

/**
 *
 * Restablecer contraseña
 *
 */
exports.reset = function(req, res) {

    var options = {
        host: req.body.host || 'http://localhost:3000',
        name: req.body.name || 'MySite',
        email_from: req.body.email_from || null
    };

    User.findOne({ 
        resetPasswordToken: req.params.token
        // resetPasswordExpires: { $gt: Date.now() }
    }, function (err, user) {
        if (!user) return res.status(401).json({
            status: 401,
            err: 'El token de restablecimiento de contraseña no es válido o ha caducado. Intenta de nuevo.'
        });
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function (err, user) {
            options.email_to = user.email;
            var webMail = service.createWebMail("RESET", options);

            // Enviar email reset
            webMail.sendMail(function (error, info) {
                if (error) return res.status(500).json({
                    status: 500, 
                    err: "Error de conección con el WebMail. Inténtalo mas tarde.",
                    error: error
                });
                // Success!!
                res.status(200).json({
                    status: 200,
                    info: info,
                    user: user,
                    message: '¡Éxito! Tu contraseña ha sido cambiada.'
                });
            });
        });
    });
}