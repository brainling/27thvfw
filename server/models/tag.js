'use strict';

var mongoose = require('mongoose');
var Joi = require('joi');
var Joigoose = require('joigoose')(mongoose);

var schema = Joi.object({
    tag: Joi.string().required().min(2).max(25).meta({ index: true, lowercase: true }),
    rank: Joi.number().required()
});

var model = mongoose.model('Tag', Joigoose.convert(schema), 'tagCache');
model.validationSchema = schema;
module.exports = model;
