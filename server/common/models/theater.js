'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().max(128).allow('').meta({ index: true })
});

let model = mongoose.model('Theater', Joigoose.convert(schema), 'theaters');
model.validationSchema = schema;
module.exports = model;
