'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().meta({ index: true })
});

let model = mongoose.model('Migration', Joigoose.convert(schema), 'migrations');
model.validationSchema = schema;
module.exports = model;
