'use strict';

const Pilot = require('../../common/models/pilot');
const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');

module.exports = [
    {
        path: '/api/pilots/auto-complete',
        method: 'GET',
        config: {
            validate: {
                query: {
                    query: Joi.string().max(64)
                }
            }
        },
        handler: (request, reply) => {
            var query = Pilot.find()
                .limit(5);

            if (request.query.query) {
                query.where('name', new RegExp('^' + request.query.query + '', 'i'));
            }

            query.exec()
                .then(pilots => {
                    reply(_.map(pilots, pilot => {
                        return pilot.name;
                    }));
                })
                .catch(err => {
                    reply(Boom.badImplementation(err));
                });
        }
    }
];
