'use strict';

angular.module('27th.acmi.services.acmi', [])
    .service('acmiService', class {
        constructor($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }

        get() {
            var deferred = this.$q.defer();
            this.$http.get('/api/acmi').then(function(response) {
                deferred.resolve(response.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    });
