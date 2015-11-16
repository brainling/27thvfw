'use strict';

const _ = require('lodash');
const base = require('./fetch-service-base');

angular.module('27th.acmi.services.acmi', [])
    .service('acmiService', class extends base {
        constructor($http, $q) {
            super($http, $q);
        }

        get(params) {
            return this.getAsync('/api/acmi', params || {}, data => {
                for (let item of data) {
                    item.downloadPath = () => {
                        var file = item.files[ 0 ];
                        return 'https://' + file.bucket + '.s3-us-west-2.amazonaws.com/acmis/' +
                            file.key + '/' + file.file;
                    };
                }

                return data;
            });
        }

        getPolicy() {
            return this.getAsync('/api/acmi/policy');
        }

        count(params) {
            return this.getAsync('/api/acmi/count', params || {});
        }

        upload(acmi) {
            return this.postAsync('/api/acmi', acmi);
        }

        getMissionTypes() {
            return [
                {
                    name: 'Campaign',
                    value: 'Campaign'
                },
                {
                    name: 'TE',
                    value: 'TE'
                },
                {
                    name: 'Dogfight',
                    value: 'Dogfight'
                }
            ];
        }
    });
