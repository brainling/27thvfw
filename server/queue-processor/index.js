#!/usr/bin/env node
'use strict';

let mongoose = require('mongoose');
let amqp = require('amqp');
let config = require('../../config').get('/');
let Tag = require('../common/models/tag');
let winston = require('winston');

winston.level = config.logging.debug ? 'debug' : 'info';

function updateTagInCache(tag, cb) {
    Tag.findOne({tag: tag.toLowerCase()}, function (err, cached) {
        if (err) {
            winston.error(err);
            return cb();
        }

        if (!cached) {
            var newTag = new Tag({tag: tag, rank: 1});
            newTag.save(function (err) {
                if (err) {
                    winston.error(err);
                }

                return cb();
            });
        }
        else {
            Tag.update({tag: tag.toLowerCase()}, {rank: cached.rank + 1}, function (err) {
                if (err) {
                    winston.error(err);
                }

                return cb();
            });
        }
    });
}

function updateTags(getItem) {
    function nextTag() {
        let item = getItem();
        if (item) {
            winston.debug('Updating tag: %s', item);
            updateTagInCache(item, nextTag);
        }
    }

    nextTag();
}

module.exports = function () {
    const connection = amqp.createConnection({
        url: config.queues.rabbit.url
    });

    connection.on('ready', function () {
        const exchange = connection.exchange('tag.updates', {
            durable: true,
            autoDelete: false,
            confirm: true
        });

        const queue = connection.queue('tag.updates', {
            durable: true,
            autoDelete: false
        }, function () {
            queue.bind(exchange, '', function () {
                winston.info('Queue processor started (' + (process.env.NODE_ENV || 'dev') + ')');

                mongoose.connect(config.db.mongo.url);
                queue.subscribe(function (tags, headers, deliveryInfo, messageObject) {
                    try {
                        winston.debug('Got tags: %s', tags);
                        if (Array.isArray(tags)) {
                            updateTags(function () {
                                return tags.pop();
                            });
                        }
                    }
                    catch (err) {
                        winston.error(err);
                        return true;
                    }
                });
            });
        });
    });
};
