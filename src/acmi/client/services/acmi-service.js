'use strict';

const _ = require('lodash');
const base = require('./fetch-service-base');

angular.module('27th.acmi.services.acmi', [])
    .service('acmiService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get(params) {
            return this.getAsync('/api/acmi', params || {});
        }

        getPolicy() {
            return this.getAsync('/api/acmi/policy');
        }

        count(params) {
            return this.getAsync('/api/acmi/count', params || {});
        }

        upload(acmi) {
            return this.postAsync('/api/acmi', acmi);
        }
    });
