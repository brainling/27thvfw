'use strict';

const base = require('./fetch-service-base');
angular.module('27th.common.services.theater', [])
    .service('theaterService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get() {
            return this.getAsync('/api/theaters');
        }
    });
