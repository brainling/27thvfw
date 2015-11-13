'use strict';

let _ = require('lodash');

angular.module('27th.acmi.upload', [
        '27th.acmi.services.acmi',
        '27th.acmi.services.pilot',
        '27th.acmi.services.tag'
    ])
    .controller('UploadAcmiController', class {
        constructor($location, acmiService, pilotService, tagService, alertService) {
            this.$location = $location;
            this.acmiService = acmiService;
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.alertService = alertService;

            this.acmi = {
                title: '',
                details: '',
                tags: [],
                pilots: [],
                files: [ 'test' ]
            };
        }

        uploadAcmi() {
            let acmi = angular.copy(this.acmi);
            let self = this;

            acmi.tags = _.map(acmi.tags, t => t.text);
            acmi.pilots = _.map(acmi.pilots, p => p.text);
            this.acmiService.upload(acmi).then(function() {
                self.$location.path('/');
                self.alertService.success('ACMI uploaded!');
            }, function(err) {
                self.alertService.error('Could not upload ACMI: ' + err.message);
            });
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
