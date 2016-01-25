'use strict';

angular.module('27th.acmi.login', [
    '27th.common.services.auth',
    '27th.common.services.alert'
])
    .controller('LoginController', class {
        constructor($location, authService, alertService) {
            this.$location = $location;
            this.authService = authService;
            this.alertService = alertService;

            this.email = '';
            this.password = '';
        }

        login() {
            this.authService.login(this.email, this.password)
                .then(() => this.$location.path('/'))
                .catch(err => this.alertService.error(err));
        }
    });
