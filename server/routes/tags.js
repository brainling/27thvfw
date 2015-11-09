'use strict';

var Tag = require('../models/tag');
var Joi = require('joi');
var Boom = require('boom');
var _ = require('lodash');

module.exports = [
    {
        path: '/api/tags/auto-complete',
        method: 'GET',
        config: {
            validate: {
                query: {
                    query: Joi.string().max(25)
                }
            }
        },
        handler: function (request, reply) {
            var query = Tag.find()
                .limit(5);

            if (request.query.query) {
                query.where('tag', new RegExp('^' + request.query.query, 'i'));
            }

            query.sort('-rank')
                .exec()
                .then(function (tags) {
                    reply(_.map(tags, function(tag) {
                        return tag.tag;
                    }));
                }, function (err) {
                    reply(Boom.badImplementation(err));
                });
        }
    }
];
