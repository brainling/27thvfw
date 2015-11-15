'use strict';

angular.module('27th.acmi.directives.alertContainer', [
    '27th.acmi.services.alert'
])
    .directive('alertContainer', function () {
        return {
            restrict: 'E',
            templateUrl: './directives/alert-container.html',
            controllerAs: 'vm',
            controller: class {
                constructor($rootScope, alertService) {
                    let self = this;
                    this.alertService = alertService;
                    this.alert = null;

                    $rootScope.$on('alerts.new', () => {
                        if(!self.alert) {
                            self.alert = alertService.nextAlert();
                        }
                    });
                }

                dismissAlert() {
                    this.alert = this.alertService.nextAlert();
                }
            }
        };
    });
