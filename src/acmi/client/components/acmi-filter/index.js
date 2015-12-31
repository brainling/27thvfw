'use strict';

const _ = require('lodash');

angular.module('27th.acmi.filter', [
        'ngTagsInput',
        '27th.acmi.services.acmi',
        '27th.common.services.pilot',
        '27th.acmi.services.tag',
        '27th.common.services.theater'
    ])
    .controller('AcmiFilterController', class {
        constructor($rootScope, $q, acmiService, pilotService, tagService, theaterService) {
            this.$rootScope = $rootScope;
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.title = '';
            this.tags = [];
            this.pilots = [];
            this.popularTags = [];
            this.hasVideo = false;
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

            const debouncedApply = () => {
                this.$rootScope.$emit('acmi.filterChanged', {
                    title: this.title,
                    theater: this.theater,
                    missionType: this.missionType,
                    tags: _.map(this.tags, t => t.text),
                    pilots: _.map(this.pilots, p => p.text),
                    hasVideo: this.hasVideo
                });
            };
            this.applyFilters = _.debounce(debouncedApply, 500);

            $q.all([
                    tagService.get(null, 10),
                    theaterService.get()
                ])
                .then(data => {
                    this.popularTags = data[0];
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
