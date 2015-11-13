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
                    query: Joi.string().max(25).allow(''),
                    top: Joi.number().min(3).max(25).default(5)
                }
            }
        },
        handler: function (request, reply) {
            var query = Tag.find()
                .limit(request.query.top);

            if (request.query.query && request.query.query.length > 0) {
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
