'use strict';

const amqp = require('amqp');
const config = require('../../../config').get('/queues');

exports.register = function (server, options, next) {
    const connection = amqp.createConnection({
        url: config.rabbit.url
    });

    connection.on('ready', () => {
        const exchange = connection.exchange('tag.updates', {
            durable: true,
            autoDelete: false,
            confirm: true
        });

        exchange.on('open', () => {
            server.decorate('reply', 'publishTagUpdates', (tags, done) => {
                exchange.publish('', tags);
                done();
            });

            next();
        });
    });
};

exports.register.attributes = {
    name: '27thvfw.queues',
    version: '1.0.0'
};
