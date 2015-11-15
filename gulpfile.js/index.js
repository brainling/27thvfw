'use strict';

const gulp = require('gulp');
require('./acmi');

gulp.task('build', [ 'build:acmi' ]);
gulp.task('watch', [ 'build', 'watch:acmi' ]);
gulp.task('default', [ 'build' ]);
