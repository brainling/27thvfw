'use strict';

const gulp = require('gulp');
require('./common');
require('./client')('acmi');
require('./client')('training');
require('./client')('admin');

gulp.task('build', [ 'build:acmi', 'build:training', 'build:admin' ]);
gulp.task('watch', [ 'build', 'watch:acmi', 'watch:training' ]);
gulp.task('default', [ 'build' ]);
