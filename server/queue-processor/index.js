#!/usr/bin/env node
'use strict';

let mongoose = require('mongoose');
let amqp = require('amqp');
let config = require('../../config').get('/');
let Tag = require('../common/models/tag');

function updateTagInCache(tag, cb) {
    Tag.findOne({tag: tag.toLowerCase()}, function (err, cached) {
        if (err) {
            console.log(err);
            return cb();
        }

        if (!cached) {
            var newTag = new Tag({tag: tag, rank: 1});
            newTag.save(function (err) {
                if (err) {
                    console.log(err);
                }

                return cb();
            });
        }
        else {
            Tag.update({tag: tag.toLowerCase()}, {rank: cached.rank + 1}, function (err) {
                if (err) {
                    console.log(err);
                }

                return cb();
            });
        }
    });
}

function updateTags(getItem) {
    function nextTag() {
        let item = getItem();
        if(item) {
            updateTagInCache(item, nextTag);
        }
    }

    nextTag();
}

module.exports = function() {
    const connection = amqp.createConnection({
        url: config.queues.rabbit.url
    });

    connection.on('ready', function () {
        const queue = connection.queue('tag.updates', {
            durable: true,
            autoDelete: false
        }, function () {
            console.log('Queue processor started (' + (process.env.NODE_ENV || 'dev') + ')');

            mongoose.connect(config.db.mongo.url);
            queue.subscribe(function (msg, headers, deliveryInfo, messageObject) {
                try {
                    var updates = JSON.parse(msg);
                    if (Array.isArray(updates)) {
                        updateTags(function () {
                            return updates.pop();
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                }
            });
        });
    });
};
