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
        this.server = new hapi.Server({debug: {request: ['error']}});
        this.server.connection({
            host: '0.0.0.0',
            port: 5000
        });

        this.server.register([
            require('inert'),
            require('./plugins/queues')
        ], err => {
            if(err) {
                throw err;
            }

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
    const server = new Server(() => {
        server.start();
    });
};
