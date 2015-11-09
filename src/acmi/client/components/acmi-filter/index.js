'use strict';

angular.module('27th.acmi.filter', [
    'ngTagsInput',
    '27th.acmi.services.pilot',
    '27th.acmi.services.tag'
])
    .controller('AcmiFilterController', class {
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
