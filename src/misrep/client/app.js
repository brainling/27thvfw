/* globals window */
'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');

require('angular');
require('angular-new-router');
require('angular-ui-bootstrap');

require('templates');
require('templates-common');
require('common');

require('./components/topnav');
require('./components/record-flight');

angular.module('27th.misrep', [
        'ngNewRouter',
        '27th.common.templates',
        '27th.misrep.templates',
        '27th.common.emptySidebar',
        '27th.common.directives.alertContainer',
        '27th.misrep.topnav',
        '27th.misrep.recordFlight'
    ])
    .controller('AppController', class {
        constructor($router) {
            $router.config([
                {
                    path: '/',
                    components: {
                        'topnav': 'topnav',
                        'sidebar': 'emptySidebar',
                        'default': 'recordFlight'
                    },
                    as: 'recordFlight'
                }
            ]);
        }
    });
