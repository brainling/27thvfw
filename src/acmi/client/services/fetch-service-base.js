'use strict';

module.exports = class {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getAsync(url, params) {
        let deferred = this.$q.defer();

        this.$http.get(url, { params: params || {} })
            .then(response => {
                deferred.resolve(response.data);
            })
            .catch(err => {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    postAsync(url, payload) {
        let deferred = this.$q.defer();

        this.$http.post(url, payload)
            .then(response => {
                deferred.resolve(response.data);
            })
            .catch(err => {
                deferred.reject(err);
            });

        return deferred.promise;
    }
};
