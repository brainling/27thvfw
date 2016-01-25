'use strict';


const hapi = require('hapi');
const winston = require('winston');
const config = require('../../config').get('/');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use ES6 promises

winston.level = config.logging.debug ? 'debug' : 'info';

if(!RegExp.escapeString) {
    RegExp.escapeString =  function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
}

class Server {
    constructor(ready) {
        this.server = new hapi.Server({
            debug: {
                request: ['error']
            },
            cache: [
                {
                    name: 'sessionCache',
                    engine: require('catbox-mongodb'),
                    uri: config.db.mongo.url,
                    partition: 'cache'
                }
            ]
        });
        this.server.connection({
            host: '0.0.0.0',
            port: 5000
        });

        this.server.register([
            require('hapi-auth-cookie'),
            require('inert'),
            require('./plugins/queues')
        ], err => {
            if(err) {
                throw err;
            }

            const timeout = 3 * 24 * 60 * 60 * 1000; // 3 days
            const cache = this.server.cache({
                cache: 'sessionCache',
                segment: 'sessions',
                expiresIn: timeout
            });
            this.server.app.cache = cache;

            this.server.auth.strategy('session', 'cookie', {
                password: config.auth.cookie.secret,
                cookie: config.auth.cookie.sid,
                isSecure: config.auth.cookie.secure,
                validateFunc: function(request, session, callback) {
                    cache.get(session.sid, (err, cached) => {
                        if(err) {
                            return callback(err, false);
                        }

                        if(!cached) {
                            return callback(null, false);
                        }

                        return callback(null, true, cached.account);
                    });
                }
            });

            mongoose.connect(config.db.mongo.url);

            this.server.route(require('./routes/auth'));
            this.server.route(require('./routes/acmi'));
            this.server.route(require('./routes/pilots'));
            this.server.route(require('./routes/tags'));
            this.server.route(require('./routes/theaters'));

            let clients = require('./routes/client');
            this.server.route(clients);

            ready();
        });
    }

    start() {
        this.server.start(() => {
            winston.info('Web server started (' + (process.env.NODE_ENV || 'dev') + ')');
        });
    }
}

module.exports = function() {
    try {
        const server = new Server(() => {
            server.start();
        });
    }
    catch(e) {
        winston.error(e);
    }
};
