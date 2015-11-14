'use strict';

var path = require('path');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function(request, response) {
            return response.redirect('/acmi');
        }
    },
    {
        method: 'GET',
        path: '/acmi',
        handler: {
            file: 'dist/acmi/index.html'
        }
    },
    {
        method: 'GET',
        path: '/acmi/{filename}',
        handler: {
            file: function(request) {
                return path.join('dist/acmi', request.params.filename);
            }
        }
    },
    {
        method: 'GET',
        path: '/fonts/{filename}',
        handler: {
            file: function(request) {
                    return path.join('node_modules/bootstrap/fonts', request.params.filename);
            }
        }
    }
];
