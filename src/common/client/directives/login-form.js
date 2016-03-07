'use strict';

angular.module('27th.common.directives.loginForm', [
    '27th.common.services.auth',
    '27th.common.services.alert'
])
    .directive('loginForm', () => {
        return {
            restrict: 'E',
            templateUrl: './directives/login-form.html',
            scope: {
                redirect: '=?'
            },
            controllerAs: 'vm',
            controller:  class {
                constructor($location, authService, alertService) {
                    this.$location = $location;
                    this.authService = authService;
                    this.alertService = alertService;

                    this.email = '';
                    this.password = '';
                }

                login() {
                    this.authService.login(this.email, this.password)
                        .then(() => this.$location.path(this.redirect || '/'))
                        .catch(err => this.alertService.error(err));
                }
            }
        };
    });
