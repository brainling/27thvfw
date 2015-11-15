'use strict';

const Tag = require('../../common/models/tag');
const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');

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
        handler: (request, reply) => {
            var query = Tag.find()
                .sort('-rank')
                .limit(request.query.top);

            if (request.query.query && request.query.query.length > 0) {
                query.where('tag', new RegExp('^' + request.query.query, 'i'));
            }

            query
                .exec()
                .then(tags => {
                    reply(_.map(tags, tag => tag.tag));
                })
                .catch(err => reply(Boom.badImplementation(err)));
        }
    }
];
