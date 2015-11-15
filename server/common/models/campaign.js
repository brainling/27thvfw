'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().max(128).allow('').meta({ index: true })
});

let model = mongoose.model('Campaign', Joigoose.convert(schema), 'campaigns');
model.validationSchema = schema;
module.exports = model;
