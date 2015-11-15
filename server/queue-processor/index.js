#!/usr/bin/env node
'use strict';

const mongoose = require('mongoose');
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

module.exports = function() {
    const connection = amqp.createConnection({
        url: config.queues.rabbit.url
    });

    connection.on('ready', () => {
        const exchange = connection.exchange('tag.updates', {
            durable: true,
            autoDelete: false,
            confirm: true
        });

        const queue = connection.queue('tag.updates', {
            durable: true,
            autoDelete: false
        }, () => {
            queue.bind(exchange, '', () => {
                winston.info('Queue processor started (' + (process.env.NODE_ENV || 'dev') + ')');

                mongoose.connect(config.db.mongo.url);
                queue.subscribe({ ack: true }, (tags, headers, deliveryInfo, messageObject) => {
                    try {
                        winston.debug('Got tags: %s', tags);
                        if (Array.isArray(tags)) {
                            cacheTags(() => tags.pop())
                                .then(() => {
                                    queue.shift();
                                });
                        }
                    }
                    catch (err) {
                        winston.error(err);
                        queue.shift(true);
                    }
                });
            });
        });
    });
};
