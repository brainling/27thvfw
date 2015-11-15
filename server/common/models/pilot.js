'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().required().min(3).max(128).meta({ index: true }),
    pilotId: Joi.string().meta({ index: true })
});

let model = mongoose.model('Pilot', Joigoose.convert(schema), 'pilots');
model.validationSchema = schema;
module.exports = model;
