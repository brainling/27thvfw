/* globals window */
'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');

require('angular');
require('angular-new-router');
require('ng-tags-input');
require('ng-file-upload');
require('angular-truncate-2');
require('angular-clipboard');
require('angular-youtube-embed');
require('angular-ui-bootstrap');

require('templates');
require('templates-common');
require('common');

require('./services/acmi-service');
require('./services/tag-service');

require('./components/acmi');
require('./components/acmi-details');
require('./components/upload-acmi');
require('./components/acmi-filter');
require('./components/empty-sidebar');
require('./components/topnav');

angular.module('27th.acmi', [
    'ngNewRouter',
    '27th.common.templates',
    '27th.common.directives.alertContainer',
    '27th.acmi.templates',
    '27th.acmi.log',
    '27th.acmi.details',
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
                    path: '/:id/:slug',
                    components: {
                        'topnav': 'topnav',
                        'sidebar': 'emptySidebar',
                        'default': 'acmiDetails'
                    },
                    as: 'details'
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
