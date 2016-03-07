'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

let schema = Joi.object({
    pilot: Joi.string().meta({ type: 'ObjectId', ref: 'Pilot' }),
    totalDuration: Joi.number().required().min(0),
    totalTrainingDuration: Joi.number().required().min(0),
    totalAirKills: Joi.number().required().min(0),
    totalGroundKills: Joi.number().required().min(0),
    totalRefuels: Joi.number().required().min(0),
    totalTrainingRefuels: Joi.number().required().min(0),
    sorties: Joi.number().required().min(0),
    rtbRate: Joi.number().required().min(0).max(100)
});

let model = mongoose.model('PilotStat', Joigoose.convert(schema), 'pilotStats');
model.validationSchema = schema;
module.exports = model;
