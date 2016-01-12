'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const needle = require('needle');
const config = require('../../../config').get('/');

function enjinApiRequest(call, params, sessionId) {
    return new Promise((resolve, reject) => {
        let fparams = params;
        if(sessionId) {
            fparams = _.merge({ session_id: sessionId }, fparams);
        }
        else {
            fparams = _.merge({ api_key: config.enjin.api.key }, fparams);
        }
        needle.post('http://www.27thvfw.org/api/v1/api.php', {
            jsonrpc: '2.0',
            id: Math.round(Math.random() * (999999 - 100000) + 100000),
            method: call,
            params: fparams
        }, { json: true }, function (err, response) {
            if (err) {
                return reject(err);
            }

            resolve(response.body);
        });
    });
}

module.exports = [
    {
        path: '/api/auth/login',
        method: 'POST',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email(),
                    password: Joi.string()
                }
            }
        },
        handler: (request, reply) => {
            enjinApiRequest('User.login', {
                email: request.payload.email,
                password: request.payload.password
            })
                .then(response => {
                    return enjinApiRequest('Tags.get', {
                        user_id: response.result.user_id
                    })
                        .then(response => {
                            reply(response);
                        });
                })
                .catch(err => {
                    reply(Boom.unauthorized(err));
                });
        }
    },
    {
        path: '/api/auth/check/{session}',
        method: 'GET',
        config: {
            validate: {
                params: {
                    session: Joi.string()
                }
            }
        },
        handler: (request, reply) => {
            enjinApiRequest('User.checkSession', {
                session_id: request.params.session
            })
                .then(response => {
                    return enjinApiRequest('Tags.get', { user_id: response.result.user_id })
                        .then(tags => {
                            reply(_.merge(response.result, { tags: tags.result }));
                        });
                })
                .catch(err => {
                    reply(Boom.unauthorized(err));
                });
        }
    }
];
