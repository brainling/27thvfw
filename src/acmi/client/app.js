/* globals window */
'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');

require('angular');
require('angular-new-router');
require('ng-tags-input');
require('templates');
require('angular-ui-bootstrap');

require('./services/alert-service');
require('./services/acmi-service');
require('./services/pilot-service');
require('./services/tag-service');

require('./directives/alert-container');

require('./components/acmi');
require('./components/upload-acmi');
require('./components/acmi-filter');
require('./components/empty-sidebar');
require('./components/topnav');

angular.module('27th.acmi', [
    'ngNewRouter',
    '27th.acmi.directives.alertContainer',
    '27th.templates',
    '27th.acmi.log',
    '27th.acmi.upload',
    '27th.acmi.filter',
    '27th.acmi.emptySidebar',
    '27th.acmi.topnav'
])
    .controller('AppController', class {
        constructor($router) {
            $router.config([
                {
                    path: '/',
                    components: {
                        'topnav': 'topnav',
                        'sidebar': 'acmiFilter',
                        'default': 'acmi'
                    },
                    as: 'log'
                },
                {
                    path: '/upload',
                    components: {
                        'topnav': 'topnav',
                        'sidebar': 'emptySidebar',
                        'default': 'uploadAcmi'
                    },
                    as: 'upload'
                }
            ]);
        }
    });
