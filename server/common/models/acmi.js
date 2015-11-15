'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    title: Joi.string().required().min(3).max(128).meta({ index: true }),
    details: Joi.string().max(2048),
    pilots: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string().min(2).max(25).meta({ lowercase: true })).meta({ index: true }),
    files: Joi.array().items(Joi.object({
        file: Joi.string(),
        key: Joi.string()
    })).required(),
    uploadedAt: Joi.date().default(() => Date.now(), 'Defaults to the current time')
});

let model = mongoose.model('Acmi', Joigoose.convert(schema), 'acmis');
model.validationSchema = schema;
module.exports = model;
