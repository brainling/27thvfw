'use strict';

const crypto = require('crypto');
const Flight = require('../../common/models/flight');
const PilotStat = require('../../common/models/pilotStat');
const Joi = require('joi');
const Boom = require('boom');
const config = require('../../../config').get('/storage');
const slug = require('slug');
const _ = require('lodash');

module.exports = [
    {
        path: '/api/wing-stats',
        method: 'GET',
        handler: (request, reply) => {
            PilotStat.find()
                .populate('pilot')
                .sort('-pilot.pilotId')
                .exec()
                .then(stats => reply(stats))
                .catch(err => reply(Boom.badImplementation(err)));
        }
    },
    {
        path: '/api/misrep',
        method: 'POST',
        config: {
            validate: {
                payload: Flight.validationSchema
            }
        },
        handler: (request, reply) => {
            request.payload.pilot = request.auth.credentials.poid;

            Flight.create(request.payload)
                .then(acmi => reply())
                .catch(err => reply(Boom.badImplementation(err)));
        }
    }
];
