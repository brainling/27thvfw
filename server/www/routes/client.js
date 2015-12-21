'use strict';

const path = require('path');
const production = process.env.NODE_ENV === 'production';

function clientRoutes(client) {
    return [
        {
            method: 'GET',
            path: `/${client}`,
            handler: {
                file: production ? `dist/${client}/index.min.html` : `dist/${client}/index.html`
            }
        },
        {
            method: 'GET',
            path: `/${client}/{filename}`,
            handler: {
                file: request => {
                    return path.join(`dist/${client}`, request.params.filename);
                }
            }
        }
    ];
}

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
        path: '/fonts/{filename}',
        handler: {
            file: request => {
                return path.join('node_modules/bootstrap/fonts', request.params.filename);
            }
        }
    }
]
    .concat(clientRoutes('acmi'),
        clientRoutes('misrep'),
        clientRoutes('training'),
        clientRoutes('admin'));
