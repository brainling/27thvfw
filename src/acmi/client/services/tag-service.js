'use strict';

angular.module('27th.acmi.services.tag', [])
    .service('tagService', class {
        constructor($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }

        get(query) {
            var deferred = this.$q.defer();

            var url = '/api/tags/auto-complete' + (query ? '?query=' + query.trim() : '');
            this.$http.get(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    });
