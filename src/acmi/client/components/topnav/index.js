'use strict';

angular.module('27th.acmi.topnav', [
    '27th.common.services.auth'
])
    .controller('TopnavController', class {
        constructor($rootScope, authService) {
            this.authService = authService;
            this.isLoggedIn = authService.isAuthenticated();
            this.user = authService.getCredentials();

            if(!this.user) {
                this.loading = true;
            }

            $rootScope.$on('auth.stateChanged', (evt, state) => {
                this.isLoggedIn = state;
                this.user = authService.getCredentials();
            });

            $rootScope.$on('auth.started', () => {
                this.loading = false;
            });
        }

        logout() {
            this.authService.logout();
        }
    });
