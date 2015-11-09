'use strict';

angular.module('27th.acmi.upload', [])
    .controller('UploadAcmiController', class {
        constructor(pilotService, tagService) {
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.tags = [];
            this.pilots = [];
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
