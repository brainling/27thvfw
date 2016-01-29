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
            this.started = false;
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

        start() {
            function doStart() {
                if(!this.started) {
                    this.started = true;
                    this.$rootScope.$emit('auth.started');
                }
            }

            this.check()
                .then(() => {
                    doStart.call(this);
                })
                .catch(err => {
                    doStart.call(this);
                    throw err;
                });
        }

        check() {
            return authGet.call(this, '/api/auth/check');
        }

        require(group, done) {
            if(!this.credentials || this.credentials.groups.length === 0 ||
                    this.credentials.groups.indexOf(group) === -1) {
                setTimeout(() => this.$location.path('/'), 1);
            }
            else {
                done();
            }
        }

        isAuthorized(group) {
            return this.isAuthenticated() &&
                    this.credentials.groups.length > 0 &&
                    this.credentials.groups.indexOf(group) !== -1;
        }

        isAuthenticated() {
            return this.credentials !== null;
        }

        getCredentials() {
            return this.credentials;
        }
    });
