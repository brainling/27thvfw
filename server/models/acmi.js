'use strict';

var mongoose = require('mongoose');
var Joi = require('joi');
var Joigoose = require('joigoose')(mongoose);

var schema = Joi.object({
    title: Joi.string().required().min(3).max(128).meta({ index: true }),
    details: Joi.string().max(2048),
    pilots: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string().min(2).max(25).meta({ lowercase: true })).meta({ index: true }),
    files: Joi.array().items(Joi.string()).required(),
    uploadedAt: Joi.date().default(function () {
        return Date.now();
    }, 'Defaults to the current time')
});

var model = mongoose.model('Acmi', Joigoose.convert(schema), 'acmis');
model.validationSchema = schema;
module.exports = model;
