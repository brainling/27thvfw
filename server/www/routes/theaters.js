'use strict';

const Theater = require('../../common/models/theater');
const Boom = require('boom');
const _ = require('lodash');

module.exports = [
    {
        path: '/api/theaters',
        method: 'GET',
        handler: (request, reply) => {
            Theater.find()
                .then(theaters => reply(theaters))
                .catch(err => reply(Boom.badImplementation(err)));
        }
    }
];
