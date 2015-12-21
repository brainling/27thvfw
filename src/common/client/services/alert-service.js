'use strict';

angular.module('27th.common.services.alert', [])
    .service('alertService', class {
        constructor($rootScope) {
            this.alerts = [];
            this.$rootScope = $rootScope;
        }

        success(msg) {
            this.alerts.push({ type: 'success', message: msg });
            this.$rootScope.$emit('alerts.new');
        }

        error(msg) {
            this.alerts.push({ type: 'error', message: msg });
            this.$rootScope.$emit('alerts.new');
        }

        nextAlert() {
            return this.alerts.pop();
        }
    });
