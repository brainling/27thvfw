'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    tag: Joi.string().required().min(2).max(25).meta({ index: true, lowercase: true }),
    rank: Joi.number().required()
});

let model = mongoose.model('Tag', Joigoose.convert(schema), 'tagCache');
model.validationSchema = schema;
module.exports = model;
