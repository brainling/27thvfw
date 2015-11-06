'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', function () {
    gulp.src([ 'Gulpfile.js', 'app.js', 'routes/**/*.js', 'models/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
