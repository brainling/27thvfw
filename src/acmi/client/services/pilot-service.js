'use strict';

var base = require('./fetch-service-base');
angular.module('27th.acmi.services.pilot', [])
    .service('pilotService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get(query) {
            query = query || '';
            return this.getAsync('/api/pilots/auto-complete', {
                query: query.trim()
            });
        }
    });
