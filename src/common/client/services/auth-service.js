'use strict';

function authPost(url, params) {
    return this.postAsync(url, params)
        .then(res => {
            this.credentials = res;
            this.$rootScope.$emit('auth.stateChanged', true);
            return true;
        })
        .catch(err => {
            this.credentials = null;
            this.$rootScope.$emit('auth.stateChanged', false);
            throw err.data.message;
        });
}

function authGet(url) {
    return this.getAsync(url)
        .then(res => {
            this.credentials = res;
            this.$rootScope.$emit('auth.stateChanged', true);
            return true;
        })
        .catch(err => {
            this.credentials = null;
            this.$rootScope.$emit('auth.stateChanged', false);
            throw err.data.message;
        });
}

const base = require('./fetch-service-base');
angular.module('27th.common.services.auth', [])
    .service('authService', class extends base {
        constructor($q, $http, $rootScope, $location) {
            super($http, $q);

            this.$rootScope = $rootScope;
            this.$location = $location;
            this.credentials = null;
        }

        login(email, password) {
            return authPost.call(this, '/api/auth/login', {
                email: email,
                password: password
            });
        }

        logout() {
            this.credentials = null;
            this.$rootScope.$emit('auth.stateChanged', false);
            return this.getAsync('/api/auth/logout');
        }

        check() {
            return authGet.call(this, '/api/auth/check');
        }

        isAuthorized(group) {
            return this.check()
                .then(() => {
                    return this.isAuthenticated() &&
                        this.credentials.groups.length > 0 &&
                        this.credentials.groups.indexOf(group) !== -1;
                })
                .catch(() => false);
        }

        isAuthenticated() {
            return this.credentials !== null;
        }

        getCredentials() {
            return this.credentials;
        }
    });
