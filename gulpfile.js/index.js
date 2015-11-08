'use strict';

var gulp = require('gulp');
require('./acmi');

gulp.task('build', [ 'build:acmi' ]);
gulp.task('default', [ 'build' ]);
