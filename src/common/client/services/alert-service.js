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
            let message = msg;
            if(typeof msg !== 'string') {
                if(msg.message) {
                    message = msg.message;
                }
                else if(msg.error && msg.error.message) {
                    message = msg.error.message;
                }
            }

            this.alerts.push({ type: 'error', message: message });
            this.$rootScope.$emit('alerts.new');
        }

        nextAlert() {
            return this.alerts.pop();
        }
    });
