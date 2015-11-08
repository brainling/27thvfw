'use strict';

var hapi = require('hapi');
class Server {
    constructor(ready) {
        this.server = new hapi.Server({debug: {request: ['error']}});
        this.server.connection({
            host: '0.0.0.0',
            port: 5000
        });

        var self = this;
        this.server.register([
            require('inert')
        ], function(err) {
            if(err) {
                throw err;
            }

            self.server.route(require('./routes/client'));

            ready(self);
        });
    }


    start() {
        this.server.start(function () {
            console.log('Backend server started');
        });
    }
}

module.exports = Server;
