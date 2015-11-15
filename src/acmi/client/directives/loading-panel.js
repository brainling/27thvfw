'use strict';

angular.module('27th.acmi.directives.loadingPanel', [])
    .directive('loadingPanel', () => {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                loading: '=',
                opaque: '@'
            },
            templateUrl: './directives/loading-panel.html',
            controllerAs: 'vm',
            controller: () => {

            }
        };
    });
