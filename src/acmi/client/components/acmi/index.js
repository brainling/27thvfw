'use strict';

angular.module('27th.acmi.log', [
    '27th.acmi.services.acmi'
])
    .controller('AcmiController', class {
        constructor(acmiService) {
            var self = this;

            this.acmis = [];
            acmiService.get().then(function (acmis) {
                self.acmis = acmis;
            });
        }
    });
