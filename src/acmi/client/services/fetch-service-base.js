'use strict';

module.exports = class {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getAsync(url, params) {
        var deferred = this.$q.defer();

        this.$http.get(url, { params: params || {} }).then(function(response) {
            deferred.resolve(response.data);
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    postAsync(url, payload) {
        var deferred = this.$q.defer();

        this.$http.post(url, payload).then(function(response) {
            deferred.resolve(response.data);
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }
};
