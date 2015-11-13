'use strict';

let _ = require('lodash');
let base = require('./fetch-service-base');

angular.module('27th.acmi.services.acmi', [])
    .service('acmiService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get(params) {
            return this.getAsync('/api/acmi', params || {});
        }

        count(params) {
            return this.getAsync('/api/acmi', _.merge({ count: true }, params) || { count: true });
        }

        upload(acmi) {
            return this.postAsync('/api/acmi', acmi);
        }
    });
