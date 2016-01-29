'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const needle = require('needle');
const config = require('../../../config').get('/');
const uuid = require('uuid');
const Pilot = require('../../common/models/pilot');
const Group = require('../../common/models/group');

function enjinApiRequest(call, params) {
    return new Promise((resolve, reject) => {
        params = _.merge({ api_key: config.enjin.api.key }, params || {});
        needle.post('http://www.27thvfw.org/api/v1/api.php', {
            jsonrpc: '2.0',
            id: Math.round(Math.random() * (999999 - 100000) + 100000),
            method: call,
            params: params
        }, { json: true }, function (err, response) {
            if (err) {
                return reject(err);
            }

            var payload = response.body;
            if(payload.error) {
                return reject(payload.error.message);
            }

            resolve(payload.result);
        });
    });
}

function login(email, password) {
    return enjinApiRequest('User.login', {
        email: email,
        password: password
    });
}

function checkSession(sessionId) {
    return enjinApiRequest('User.checkSession', {
        session_id: sessionId
    });
}

function getTags(userId) {
    return enjinApiRequest('Tags.get', {
        user_id: userId
    })
        .then(result => _.values(result));
}

function writeSession(request, sid, session) {
    return new Promise((resolve, reject) => {
        request.server.app.cache.set(sid, { account: session }, 0, err => {
            if(err) {
                return reject(err);
            }

            resolve(sid);
        });
    });
}

function loadPilot(callsign) {
    return Pilot.findOne({ callsign: callsign })
        .then(pilot => {
            if(!pilot) {
                throw 'Could not find pilot';
            }

            return pilot;
        });
}

function loadGroups(tags) {
    return Group.find().where('tags').in(tags)
        .then(groups => {
            if(!groups || _.isEmpty(groups)) {
                throw 'Not a member of any groups';
            }

            return _.map(groups, 'name');
        });
}

function checkGroups(request, session, tags) {
    return new Promise((resolve, reject) => {
        if(!_.isEmpty(_.xor(session.tags, tags))) {
            session.tags = tags;
            loadGroups(session.tags)
                .then(groups => {
                    session.groups = groups;
                    return writeSession(request, request.auth.artifacts.sid, session);
                })
                .then(() => {
                    resolve(session);
                })
                .catch(err => {
                    reject(err);
                });
        }
        else {
            resolve(session);
        }
    });
}

module.exports = [
    {
        path: '/api/auth/login',
        method: 'POST',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            validate: {
                payload: {
                    email: Joi.string().email(),
                    password: Joi.string()
                }
            }
        },
        handler: (request, reply) => {
            if(request.auth.isAuthenticated) {
                return reply.redirect('/api/auth/check');
            }

            let session = {};
            const sid = uuid.v4();
            login(request.payload.email, request.payload.password)
                .then(result => {
                    session.session_id = result.session_id;
                    session.uid = result.user_id;
                    return Promise.all([
                            loadPilot(result.username),
                            getTags(session.uid)
                        ]);
                })
                .then(data => {
                    const pilot = data[0];
                    const tags = data[1];

                    session.tags = tags;
                    session.pid = pilot.pilotId;
                    session.callsign = pilot.callsign;
                    session.poid = pilot._id;
                    return loadGroups(tags);
                })
                .then(groups => {
                    session.groups = groups;
                    return writeSession(request, sid, session);
                })
                .then(sid => {
                    request.cookieAuth.set({ sid: sid });
                    reply({
                        callsign: session.callsign,
                        pid: session.pid,
                        groups: session.groups
                    });
                })
                .catch(err => {
                    reply(Boom.unauthorized(err));
                });
        }
    },
    {
        path: '/api/auth/logout',
        method: 'GET',
        config: {
            auth: 'session'
        },
        handler: (request, reply) => {
            request.server.app.cache.drop(request.auth.artifacts.sid, () => {
                request.cookieAuth.clear();
                reply();
            });
        }
    },
    {
        path: '/api/auth/check',
        method: 'GET',
        config: {
            auth: 'session',
            validate: {
                params: {
                    session: Joi.string()
                }
            }
        },
        handler: (request, reply) => {
            const esid = request.auth.credentials.session_id;
            checkSession(esid)
                .then(result => getTags(result.user_id))
                .then(tags => {
                    let session = request.auth.credentials;
                    return checkGroups(request, session, tags);
                })
                .then(session => {
                    reply({
                        callsign: session.callsign,
                        pid: session.pid,
                        groups: session.groups
                    });
                })
                .catch(err => {
                    reply(Boom.unauthorized(err));
                });
        }
    }
];
