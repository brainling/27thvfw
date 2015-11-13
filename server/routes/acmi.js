'use strict';

var Acmi = require('../models/acmi');
var Tag = require('../models/tag');
var Joi = require('joi');
var Boom = require('boom');

function updateTagCache(tags, cb) {
    if (!tags || tags.length === 0) {
        return;
    }

    cb = cb || function() {};
    tags.forEach(function (tag) {
        Tag.findOne({tag: tag.toLowerCase()}, function (err, cached) {
            if (err) {
                console.log(err);
                return;
            }

            if (!cached) {
                var newTag = new Tag({tag: tag, rank: 1});
                newTag.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                return;
            }

            Tag.update({tag: tag.toLowerCase()}, {rank: cached.rank + 1}, function (err) {
                if (err) {
                    console.log(err);
                }

                cb();
            });
        });
    });
}

module.exports = [
    {
        path: '/api/acmi',
        method: 'GET',
        config: {
            validate: {
                query: {
                    page: Joi.number().min(1).max(500).default(1),
                    pageSize: Joi.number().min(10).max(50).default(15),
                    title: Joi.string().allow(''),
                    tags: Joi.array().items(Joi.string()).single(),
                    pilots: Joi.array().items(Joi.string()).single(),
                    count: Joi.boolean().default(false)
                }
            }
        },
        handler: function (request, reply) {
            var query = Acmi.find()
                .sort('-uploadedAt');

            if (!request.query.count) {
                query = query.limit(request.query.pageSize)
                    .skip((request.query.page - 1) * request.query.pageSize);
            }

            if (request.query.title && request.query.title.length > 0) {
                let filter = new RegExp('^' + RegExp.escapeString(request.query.title) + '.*', 'gi');
                query = query.where('title').regex(filter);
            }

            if (request.query.tags) {
                query = query.where('tags').in(request.query.tags);
            }

            if (request.query.pilots) {
                query = query.where('pilots').in(request.query.pilots);
            }

            if (request.query.count) {
                query.count(function (err, count) {
                    if (err) {
                        return reply(Boom.badImplementation(err));
                    }

                    return reply(count);
                });
            }
            else {
                query.exec(function (err, acmis) {
                    if (err) {
                        return reply(Boom.badImplementation(err));
                    }

                    return reply(acmis);
                });
            }
        }
    },
    {
        path: '/api/acmi',
        method: 'POST',
        config: {
            payload: {
                parse: true
            },
            validate: {
                payload: Acmi.validationSchema
            }
        },
        handler: function (request, reply) {
            var acmi = new Acmi(request.payload);
            acmi.save(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                updateTagCache(acmi.tags, function() {
                    return reply();
                });
            });
        }
    }
];
