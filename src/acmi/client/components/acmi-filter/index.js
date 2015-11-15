'use strict';

const _ = require('lodash');

angular.module('27th.acmi.filter', [
    'ngTagsInput',
    '27th.acmi.services.pilot',
    '27th.acmi.services.tag'
])
    .controller('AcmiFilterController', class {
        constructor($rootScope, pilotService, tagService) {
            let self = this;

            this.$rootScope = $rootScope;
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.title = '';
            this.tags = [];
            this.pilots = [];
            this.popularTags = [];

            this.debouncedApply = _.debounce(() => {
                self.applyFilters();
            }, 500);

            tagService.get(null, 10).then(tags => {
                self.popularTags = tags;
            });
        }

        applyFilters() {
            this.$rootScope.$emit('acmi.filterChanged', {
                title: this.title,
                tags: _.map(this.tags, t => t.text),
                pilots: _.map(this.pilots, p => p.text)
            });
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
