'use strict';

const _ = require('lodash');

angular.module('27th.acmi.log', [
        'ui.bootstrap',
        'truncate',
        '27th.acmi.services.acmi',
        '27th.acmi.services.alert'
    ])
    .controller('AcmiController', class {
        constructor($rootScope, acmiService, alertService) {
            let self = this;

            this.acmiService = acmiService;
            this.alertService = alertService;

            this.acmis = [];
            this.totalAcmis = 0;
            this.currentPage = 1;
            this.pageSize = 10;
            this.currentFilters = {};

            this.refresh();
            $rootScope.$on('acmi.filterChanged', (evt, params) => {
                self.refresh(params);
                self.currentFilters = params;
            });
        }

        refresh(params) {
            let self = this;
            this.acmiService.count(params).then(count => {
                self.totalAcmis = count;
                self.acmiService
                    .get(_.merge({
                        page: self.currentPage,
                        pageSize: self.pageSize
                    }, params))
                    .then(acmis => {
                        self.acmis = acmis;
                    })
                    .catch(err => {
                        self.alertService.error('Could not fetch ACMI\': ' + err.message);
                    });
            });
        }

        pageChanged() {
            this.refresh(this.currentFilters);
        }
    });
