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

        let self = this;
        this.server.register([
            require('inert'),
            require('./plugins/queues')
        ], err => {
            if(err) {
                throw err;
            }

            mongoose.connect(config.db.mongo.url);

            self.server.route(require('./routes/acmi'));
            self.server.route(require('./routes/pilots'));
            self.server.route(require('./routes/tags'));
            self.server.route(require('./routes/theaters'));
            self.server.route(require('./routes/client'));

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
