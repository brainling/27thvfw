'use strict';

const _ = require('lodash');

angular.module('27th.acmi.filter', [
        'ngTagsInput',
        '27th.acmi.services.acmi',
        '27th.acmi.services.pilot',
        '27th.acmi.services.tag',
        '27th.acmi.services.theater'
    ])
    .controller('AcmiFilterController', class {
        constructor($rootScope, $q, acmiService, pilotService, tagService, theaterService) {
            let self = this;

            this.$rootScope = $rootScope;
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.title = '';
            this.tags = [];
            this.pilots = [];
            this.popularTags = [];
            this.theater = null;
            this.theaters = [
                {
                    name: '<Any Theater>',
                    value: null
                }
            ];
            this.missionType = null;
            this.missionTypes = [
                {
                    name: '<Any Type>',
                    value: null
                }]
                .concat(acmiService.getMissionTypes());

            const debouncedApply = function () {
                self.$rootScope.$emit('acmi.filterChanged', {
                    title: self.title,
                    theater: self.theater,
                    missionType: self.missionType,
                    tags: _.map(self.tags, t => t.text),
                    pilots: _.map(self.pilots, p => p.text)
                });
            };
            this.applyFilters = _.debounce(debouncedApply, 500);

            $q.all([
                    tagService.get(null, 10),
                    theaterService.get()
                ])
                .then(data => {
                    self.popularTags = data[0];
                    this.theaters = this.theaters.concat(
                        _.map(data[1], t => {
                            return {
                                name: t.name,
                                value: t.name
                            };
                        }));
                });
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
