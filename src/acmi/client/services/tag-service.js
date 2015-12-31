'use strict';

const base = require('common').FetchServiceBase;
angular.module('27th.acmi.services.tag', [])
    .service('tagService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get(query, top = 5) {
            query = query || '';
            return this.getAsync('/api/tags/auto-complete', {
                query: query.trim(),
                top: top
            });
        }
    });
