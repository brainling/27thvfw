'use strict';

const base = require('./fetch-service-base');
angular.module('27th.common.services.auth', [])
    .service('authService', class extends base {
        constructor($q, $http) {
            super($http, $q);
        }

        authorize() {

        }
    });
