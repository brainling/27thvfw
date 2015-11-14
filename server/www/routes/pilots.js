'use strict';

var Pilot = require('../../common/models/pilot');
var Joi = require('joi');
var Boom = require('boom');
var _ = require('lodash');

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
        handler: function (request, reply) {
            var query = Pilot.find()
                .limit(5);

            if (request.query.query) {
                query.where('name', new RegExp('^' + request.query.query + '', 'i'));
            }

            query.exec()
                .then(function (pilots) {
                    reply(_.map(pilots, function(pilot) {
                        return pilot.name;
                    }));
                }, function(err) {
                    reply(Boom.badImplementation(err));
                });
        }
    }
];
