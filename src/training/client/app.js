/* globals window */
'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');

require('angular');
require('angular-new-router');
require('angular-ui-bootstrap');
require('templates');
require('templates-common');

require('../../common/client');
require('./components/topnav');
require('./components/dashboard');

angular.module('27th.training', [
    'ngNewRouter',
    '27th.common.templates',
    '27th.training.templates',
    '27th.common.emptySidebar',
    '27th.training.topnav',
    '27th.training.dashboard'
])
    .controller('AppController', class {
        constructor($router) {
            $router.config([
                {
                    path: '/',
                    components: {
                        'topnav': 'topnav',
                        'sidebar': 'emptySidebar',
                        'default': 'dashboard'
                    },
                    as: 'dashboard'
                }
            ]);
        }
    });
