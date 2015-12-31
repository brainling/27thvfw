'use strict';

const _ = require('lodash');
const uuid = require('uuid');

angular.module('27th.acmi.upload', [
        'ngFileUpload',
        '27th.acmi.services.acmi',
        '27th.common.services.pilot',
        '27th.acmi.services.tag',
        '27th.common.services.theater',
        '27th.common.services.alert',
        '27th.common.directives.linkErrors',
        '27th.common.directives.loadingPanel'
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
                files: [],
                slug: 'new-acmi'
            };
            this.file = null;
            this.uploading = false;
            this.uploadProgress = 0;
            this.loading = true;
            this.theaters = [];
            this.missionTypes = acmiService.getMissionTypes();

            $q.all([
                theaterService.get(),
                acmiService.getPolicy()
            ])
                .then(data => {
                    this.theaters = data[0];
                    this.policy = data[1];
                    this.loading = false;
                })
                .catch(err => {
                    alertService.error(err);
                });
        }

        uploadAcmi() {
            let acmi = angular.copy(this.acmi);

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
                        this.uploading = false;
                        this.uploadProgress = 0;

                        this.$location.path('/');
                        this.alertService.success('ACMI uploaded!');
                    })
                    .catch(err => {
                        this.uploading = false;
                        this.uploadProgress = 0;

                        this.alertService.error('Could not upload ACMI: ' + err.message);
                    });
            }, err => {
                this.alertService.error(err);
            }, evt => {
                this.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        loadPilots(query) {
            return this.pilotService.get(query);
        }

        loadTags(query) {
            return this.tagService.get(query);
        }
    });
