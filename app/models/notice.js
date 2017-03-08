var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema

var NoticeSchema = new Schema({
    title: {
        type: String,
        validate: [function(title){
            return title.length > 0;
        }, 'El "Titulo" no puede estar vacío.']
    },
    content_1: {
        type: String,
        validate: [function(content_1){
            return content_1.length > 0;
        }, 'El "Contenido Principal" no puede estar vacío.']
    },
    content_2: {
        type: String,
        validate: [function(content_2){
            return content_2.length > 0;
        }, 'El "Contenido Secundario" no puede estar vacío.']
    },
    category: {
        type: String,
        validate: [function(category){
            return category.length > 0;
        }, 'Debes seleccionar una categoría.']
    },
    autor: String,
    status: Boolean,
    url_img: String,
    created: {type: Date, default: Date.now}
});

NoticeSchema.plugin(uniqueValidator, { message: 'Lo sentimos, el {PATH} ({VALUE}) ya existe. Prueba con otro?' });
NoticeSchema.plugin(deepPopulate);

module.exports = mongoose.model('Notice', NoticeSchema)