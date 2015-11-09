'use strict';

var Acmi = require('../models/acmi');
var Tag = require('../models/tag');
var Joi = require('joi');
var Boom = require('boom');

function updateTagCache(tags) {
    if(!tags || tags.length === 0) {
        return;
    }

    tags.forEach(function(tag) {
        Tag.findOne({ tag: tag.toLowerCase() }, function(err, cached) {
            if(err) {
                console.log(err);
                return;
            }

            if(!cached) {
                var newTag = new Tag({ tag: tag, rank: 1 });
                newTag.save(function (err) {
                    if(err) {
                        console.log(err);
                    }
                });

                return;
            }

            Tag.update({ tag: tag.toLowerCase() }, { rank: cached.rank + 1 }, function(err) {
                if(err) {
                    console.log(err);
                }
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
                    pageSize: Joi.number().min(10).max(50).default(25),
                    tag: Joi.string(),
                    tags: Joi.array().items(Joi.string()),
                    pilot: Joi.string(),
                    pilots: Joi.array().items(Joi.string()),
                }
            }
        },
        handler: function(request, reply) {
            var query = Acmi.find()
                .limit(request.query.pageSize)
                .skip((request.query.page - 1) * request.query.pageSize);

            if(request.query.tag) {
                query.where('tags').in([ request.query.tag ]);
            }
            else if(request.query.tags) {
                query.where('tags').in(request.query.tags);
            }

            if(request.query.pilot) {
                query.where('pilots').in([ request.query.pilot ]);
            }
            else if(request.query.pilots) {
                query.where('pilots').in(request.query.pilots);
            }

            query.exec(function(err, acmis) {
                if(err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply(acmis);
            });
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
        handler: function(request, reply) {
            var acmi = new Acmi(request.payload);
            acmi.save(function(err) {
                if(err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply();
            });
        }
    }
];
