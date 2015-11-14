'use strict';

var mongoose = require('mongoose');
var Joi = require('joi');
var Joigoose = require('joigoose')(mongoose);

var schema = Joi.object({
    name: Joi.string().required().min(3).max(128).meta({ index: true }),
    pilotId: Joi.string().meta({ index: true })
});

var model = mongoose.model('Pilot', Joigoose.convert(schema), 'pilots');
model.validationSchema = schema;
module.exports = model;
