'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    name: Joi.string().max(128).allow('').meta({ index: true }),
    callsign: Joi.string().required().min(3).max(128).meta({ index: true }),
    pilotId: Joi.string().meta({ index: true }),
    qualifications: Joi.array().items(Joi.object({
        qualification: Joi.string().meta({ type: 'ObjectId', ref: 'Qualification' }).required(),
        qualifiedAt: Joi.date().required()
    }).meta({ _id: false }))
});

let model = mongoose.model('Pilot', Joigoose.convert(schema), 'pilots');
model.validationSchema = schema;
module.exports = model;
