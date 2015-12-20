'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().required().min(3).max(128).meta({ index: true }),
    checklist: Joi.array().items(Joi.object({
        title: Joi.string().required().min(3).max(128)
    }).meta({ _id: false })).required(),
    daysBeforeRequal: Joi.number().min(1)
});

let model = mongoose.model('Qualification', Joigoose.convert(schema), 'qualifications');
model.validationSchema = schema;
module.exports = model;
