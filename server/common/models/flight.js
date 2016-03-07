'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);
const _ = require('lodash');

let schema = Joi.object({
    pilot: Joi.string().meta({ type: 'ObjectId', ref: 'Pilot' }),
    theater: Joi.string().required().max(128),
    flightType: Joi.string().required().max(64),
    missionRole: Joi.string().required().max(128),
    duration: Joi.number().required().min(1).max(1440),
    airToAirKills: Joi.number().required.min(0),
    airToGroundKills: Joi.number().required.min(0),
    returnedToBase: Joi.boolean().required(),
    refuels: Joi.number().min(0).max(5),
    lessonLearned: Joi.string().required().min(1).max(2048),
    approved: Joi.boolean()
});

let model = mongoose.model('Flight', Joigoose.convert(schema), 'flights');
model.validationSchema = _.omit(schema, [ 'pilot', 'approved' ]);
module.exports = model;
