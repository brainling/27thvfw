'use strict';

const crypto = require('crypto');
const Acmi = require('../../common/models/acmi');
const Joi = require('joi');
const Boom = require('boom');
const config = require('../../../config').get('/storage');
const slug = require('slug');
const _ = require('lodash');

function acmiQuery(request, count) {
    let query = Acmi.find()
        .sort('-uploadedAt');

    if (!count) {
        query = query.limit(request.query.pageSize)
            .skip((request.query.page - 1) * request.query.pageSize);
    }

    if (request.query.title && request.query.title.length > 0) {
        let filter = new RegExp('^' + RegExp.escapeString(request.query.title) + '.*', 'gi');
        query.where('title').regex(filter);
    }

    if (request.query.theater && request.query.theater.length > 0) {
        query.where('theater').equals(request.query.theater);
    }

    if (request.query.missionType && request.query.missionType.length > 0) {
        query.where('missionType').equals(request.query.missionType);
    }

    if (request.query.tags) {
        query.where('tags').all(request.query.tags);
    }

    if (request.query.pilots) {
        query.where('pilots').all(request.query.pilots);
    }

    if (request.query.hasVideo) {
        query.where('videoUrl').exists();
    }

    return query;
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
                    title: Joi.string().max(128).allow(''),
                    theater: Joi.string().max(128).allow(''),
                    missionType: Joi.string().max(64).allow(''),
                    tags: Joi.array().items(Joi.string()).single(),
                    pilots: Joi.array().items(Joi.string()).single(),
                    hasVideo: Joi.boolean()
                }
            }
        },
        handler: (request, reply) => {
            acmiQuery(request, false)
                .exec()
                .then(acmis => reply(acmis))
                .catch(err => reply(Boom.badImplementation(err)));
        }
    },
    {
        path: '/api/acmi/{id}/{slug}',
        method: 'GET',
        config: {
            validate: {
                params: {
                    id: Joi.string().required(),
                    slug: Joi.string().required()
                }
            }
        },
        handler: (request, reply) => {
            Acmi.findOne({ _id: request.params.id })
                .then(acmi => reply(acmi))
                .catch(err => reply(Boom.badImplementation(err)));
        }
    },
    {
        path: '/api/acmi/count',
        method: 'GET',
        config: {
            validate: {
                query: {
                    title: Joi.string().max(128).allow(''),
                    theater: Joi.string().max(128).allow(''),
                    missionType: Joi.string().max(64).allow(''),
                    tags: Joi.array().items(Joi.string()).single(),
                    pilots: Joi.array().items(Joi.string()).single(),
                    hasVideo: Joi.boolean()
                }
            }
        },
        handler: (request, reply) => {
            acmiQuery(request, true)
                .count()
                .then(count => reply(count))
                .catch(err => reply(Boom.badImplementation(err)));
        }
    },
    {
        path: '/api/acmi',
        method: 'POST',
        config: {
            auth: 'session',
            payload: {
                parse: true
            },
            validate: {
                payload: Acmi.validationSchema
            }
        },
        handler: (request, reply) => {
            request.payload.slug = slug(request.payload.title, { lower: true });
            request.payload.uploadedBy = request.auth.credentials.pid;

            Acmi.create(request.payload)
                .then(acmi => {
                    reply.publishTagUpdates(acmi.tags, () => {
                        reply();
                    });
                })
                .catch(err => reply(Boom.badImplementation(err)));
        }
    },
    {
        path: '/api/acmi/policy',
        method: 'GET',
        config: {
            auth: 'session'
        },
        handler: (request, reply) => {
            let policyObject = {
                expiration: new Date(Date.now() + 600000).toISOString(),
                conditions: [
                    { bucket: config.aws.bucket },
                    [ 'starts-with', '$key', 'acmis/' ],
                    { acl: 'public-read' },
                    [ 'starts-with', '$Content-Type', ''],
                    [ 'starts-with', '$filename', ''],
                    [ 'content-length-range', 0, 1024 * 1024 * 25]
                ]
            };

            var policy = new Buffer(JSON.stringify(policyObject)).toString('base64');
            var signature = crypto
                .createHmac('sha1', config.aws.secret)
                .update(policy)
                .digest('base64');

            return reply({
                key: config.aws.key,
                policy: policy,
                signature: signature,
                bucket: config.aws.bucket
            });
        }
    }
];
