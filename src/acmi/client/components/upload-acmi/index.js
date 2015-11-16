'use strict';

const _ = require('lodash');
const uuid = require('uuid');

angular.module('27th.acmi.upload', [
        'ngFileUpload',
        '27th.acmi.services.acmi',
        '27th.acmi.services.pilot',
        '27th.acmi.services.tag',
        '27th.acmi.services.theater',
        '27th.acmi.directives.linkErrors',
        '27th.acmi.directives.loadingPanel'
    ])
    .controller('UploadAcmiController', class {
        constructor($location, $q, acmiService, pilotService, tagService, theaterService, alertService, Upload) {
            this.$location = $location;
            this.acmiService = acmiService;
            this.pilotService = pilotService;
            this.tagService = tagService;
            this.alertService = alertService;
            this.upload = Upload;

            this.acmi = {
                title: '',
                details: '',
                theater: 'KTO',
                missionType: 'Campaign',
                tags: [],
                pilots: [],
                files: []
            };
            this.file = null;
            this.uploading = false;
            this.uploadProgress = 0;
            this.loading = true;
            this.theaters = [];
            this.missionTypes = acmiService.getMissionTypes();

            let self = this;
            $q.all([
                theaterService.get(),
                acmiService.getPolicy()
            ])
                .then(data => {
                    self.theaters = data[0];
                    self.policy = data[1];
                    self.loading = false;
                })
                .catch(err => {
                    alertService.error(err);
                });
        }

        uploadAcmi() {
            let acmi = angular.copy(this.acmi);
            let self = this;

            acmi.tags = _.map(acmi.tags, t => t.text);
            acmi.pilots = _.map(acmi.pilots, p => p.text);

            let fileKey = uuid.v4().replace(/-/g, '');
            acmi.files = [
                {
                    file: this.file.name,
                    key: fileKey,
                    bucket: this.policy.bucket
                }
            ];

            this.uploading = true;
            let activeUpload = this.upload.upload({
                url: 'https://' + this.policy.bucket + '.s3-us-west-2.amazonaws.com/',
                method: 'POST',
                data: {
                    key: 'acmis/' + fileKey + '/' + this.file.name,
                    AWSAccessKeyId: this.policy.key,
                    acl: 'public-read',
                    policy: this.policy.policy,
                    signature: this.policy.signature,
                    'Content-Type': 'application/octet-stream',
                    filename: this.file.name,
                    file: this.file
                }
            });

            activeUpload.then(resp => {
                this.acmiService.upload(acmi)
                    .then(() => {
                        self.uploading = false;
                        self.uploadProgress = 0;

                        self.$location.path('/');
                        self.alertService.success('ACMI uploaded!');
                    })
                    .catch(err => {
                        self.uploading = false;
                        self.uploadProgress = 0;

                        self.alertService.error('Could not upload ACMI: ' + err.message);
                    });
            }, err => {
                self.alertService.error(err);
            }, evt => {
                self.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
