var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Modelo User
var UserSchema = new Schema({
    name: {
        type: String,
        validate: [function(name){
            return name.length > 0;
        }, 'Debe ingresar un Nombre']
    },
    email: {
        type: String,
        index: {unique: true},
        validate: [function(email){
            return !(!email.match(/.+\@.+\..+/));
        }, 'El Email es incorrecto.']
    },
    password: {
        type: String,
        validate: [function(password){
            return password.length >= 6;
        }, 'La Contraseña debe tener seis o mas caracteres.']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    active: {
        type: Boolean,
        default: false
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Cifrar la contraseña del usuario antes de guardarlo en la BD
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// Comparar contraseñas
UserSchema.methods.comparePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash);
};

UserSchema.plugin(uniqueValidator, { message: 'Lo sentimos, el {PATH} ({VALUE}) ya existe. Prueba con otro?' });
UserSchema.plugin(deepPopulate);

module.exports = mongoose.model('User', UserSchema);
