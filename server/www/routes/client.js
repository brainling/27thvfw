'use strict';

const path = require('path');
const production = process.env.NODE_ENV === 'production';

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, response) => {
            return response.redirect('/acmi');
        }
    },
    {
        method: 'GET',
        path: '/acmi',
        //config: {
        //    cors: {
        //        origin: [ '*' ],
        //        headers: [ 'Content-Type' ]
        //    }
        //},
        handler: {
            file: production ? 'dist/acmi/index.min.html' : 'dist/acmi/index.html'
        }
    },
    {
        method: 'GET',
        path: '/acmi/{filename}',
        handler: {
            file: request => {
                return path.join('dist/acmi', request.params.filename);
            }
        }
    },
    {
        method: 'GET',
        path: '/fonts/{filename}',
        handler: {
            file: request => {
                return path.join('node_modules/bootstrap/fonts', request.params.filename);
            }
        }
    }
];
