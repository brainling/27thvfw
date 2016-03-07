'use strict';

angular.module('27th.common.directives.alertContainer', [
    '27th.common.services.alert'
])
    .directive('alertContainer', function () {
        return {
            restrict: 'E',
            templateUrl: './directives/alert-container.html',
            controllerAs: 'vm',
            controller: class {
                constructor($rootScope, alertService) {
                    this.alertService = alertService;
                    this.alert = null;

                    $rootScope.$on('alerts.new', () => {
                        if(!this.alert) {
                            this.alert = alertService.nextAlert();
                        }
                    });
                }

                dismissAlert() {
                    this.alert = this.alertService.nextAlert();
                }
            }
        };
    });
