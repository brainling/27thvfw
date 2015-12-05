'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);
const _ = require('lodash');

let schema = Joi.object({
    title: Joi.string().required().min(3).max(128).meta({ index: true }),
    details: Joi.string().max(2048),
    pilots: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string().min(2).max(25).meta({ lowercase: true, index: true })),
    theater: Joi.string().required().max(128),
    missionType: Joi.string().required().max(64),
    videoUrl: Joi.string().max(512).allow(''),
    files: Joi.array().items(Joi.object({
        file: Joi.string(),
        key: Joi.string(),
        bucket: Joi.string()
    }).meta({ _id: false })).required(),
    slug: Joi.string().required().meta({ index: true }),
    uploadedAt: Joi.date().default(() => Date.now(), 'Defaults to the current time')
});


let model = mongoose.model('Acmi', Joigoose.convert(schema), 'acmis');
model.validationSchema = _.omit(schema, 'slug');
module.exports = model;
