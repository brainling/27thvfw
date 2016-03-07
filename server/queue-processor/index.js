#!/usr/bin/env node
'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const amqp = require('amqp');
const config = require('../../config').get('/');
const Tag = require('../common/models/tag');
const winston = require('winston');

winston.level = config.logging.debug ? 'debug' : 'info';

function cacheTag(tagName, cb) {
    Tag.findOne({ tag: tagName.toLowerCase() })
        .then((tag) => {
            let promise = null;
            if (!tag) {
                promise = Tag.create({ tag: tagName, rank: 1 });
            }
            else {
                promise = Tag.update({ tag: tagName }, { rank: tag.rank + 1 });
            }

            promise
                .then(cb)
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            winston.error(err);
            cb();
        });
}

function cacheTags(getItem) {
    return new Promise(resolve => {
        function nextTag() {
            let item = getItem();
            if (item) {
                winston.debug('Updating tag: %s', item);
                cacheTag(item, nextTag);
            }
            else {
                resolve();
            }
        }

        nextTag();
    });
}

function processTags (tags, headers, deliveryInfo, messageObject) {
    try {
        winston.debug('Got tags: %s', tags);
        if (Array.isArray(tags)) {
            cacheTags(() => tags.pop())
                .then(() => {
                    messageObject.acknowledge();
                });
        }
    }
    catch (err) {
        winston.error(err);
        messageObject.reject(true);
    }
}

function processWingStatUpdates(msg, headers, deliveryInfo, messageObject) {
    try {
        messageObject.acknowledge();
    }
    catch(err) {
        winston.error(err);
        messageObject.reject(true);
    }
}

class QueueContext {
    constructor(connection) {
        this.connection = connection;
    }

    exchange(exchangeName) {
        this.exchange = this.connection.exchange(exchangeName, {
            durable: true,
            autoDelete: false,
            confirm: true
        });

        return this;
    }

    subscribe(queueName, handler) {
        return new Promise((resolve, reject) => {
            this.queue = this.connection.queue(queueName, {
                durable: true,
                autoDelete: false
            }, resolve);
        })
            .then(() => new Promise((resolve, reject) => {
                this.queue.bind(this.exchange, '', () => {
                    this.queue.subscribe({ ack: true }, handler);
                    resolve();
                });
            }));
    }
}

module.exports = function() {
    const connection = amqp.createConnection({
        url: config.queues.rabbit.url
    });

    connection.on('ready', () => {
        winston.info('Queue processor started (' + (process.env.NODE_ENV || 'dev') + ')');

        new QueueContext(connection)
            .exchange('tag.updates')
            .subscribe('tag.updates', processTags)
            .then(() => {
                winston.info('Processing started for tag.updates...');
            });

        new QueueContext(connection)
            .exchange('wing-stat.update-requests')
            .subscribe('wing-stat.update-requests', processWingStatUpdates)
            .then(() => {
                winston.info('Processing started for wing-stat.update-requests...');
            });
    });
};
