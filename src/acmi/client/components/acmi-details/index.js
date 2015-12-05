'use strict';

angular.module('27th.acmi.details', [
    'ngNewRouter',
    'youtube-embed',
    '27th.acmi.services.acmi'
])
    .controller('AcmiDetailsController', class {
        constructor($routeParams, acmiService) {
            this.id = $routeParams.id;
            this.slug = $routeParams.slug;
            this.loading = true;
            this.acmi = {};

            acmiService.getDetails(this.id, this.slug)
                .then(acmi => {
                    this.loading = false;
                    this.acmi = acmi;
                });
        }
    });
