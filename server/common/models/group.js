'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);
const _ = require('lodash');

let schema = Joi.object({
    name: Joi.string().required().min(3).max(128).meta({ index: true }),
    tags: Joi.array().items(Joi.string()).required()
});

let model = mongoose.model('Group', Joigoose.convert(schema), 'groups');
model.validationSchema = schema;
module.exports = model;
