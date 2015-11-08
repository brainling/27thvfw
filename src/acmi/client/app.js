/* globals window */
'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');

require('angular');
require('angular-new-router');
require('templates');

require('./components/acmi/index');
require('./components/uploadAcmi/index');

angular.module('27th.acmi', [
    'ngNewRouter',
    '27th.templates',
    '27th.acmi.log',
    '27th.acmi.upload'
])
    .controller('AppController', class {
        constructor($router) {
            $router.config([
                {
                    path: '/',
                    components: {
                        'default': 'acmi'
                    }
                },
                {
                    path: '/upload',
                    components: {
                        'default': 'uploadAcmi'
                    }
                }
            ]);
        }
    });
