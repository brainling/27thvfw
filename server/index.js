'use strict';


var hapi = require('hapi');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use ES6 promises

var config = require('../config').get('/db');

if(!RegExp.escapeString) {
    RegExp.escapeString = function (str) {
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

        var self = this;
        this.server.register([
            require('inert'),
            require('./plugins/queues')
        ], function(err) {
            if(err) {
                throw err;
            }

            mongoose.connect(config.mongo.url);

            self.server.route(require('./routes/acmi'));
            self.server.route(require('./routes/pilots'));
            self.server.route(require('./routes/tags'));
            self.server.route(require('./routes/client'));

            ready(self);
        });
    }

    start() {
        this.server.start(function () {
            console.log('Web server started');
        });
    }
}

module.exports = Server;
