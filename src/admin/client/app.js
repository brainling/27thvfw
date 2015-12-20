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
require('./components/dashboard');
require('./components/topnav');

angular.module('27th.admin', [
        'ngNewRouter',
        '27th.common.templates',
        '27th.admin.templates',
        '27th.common.emptySidebar',
        '27th.admin.topnav',
        '27th.admin.dashboard'
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
