'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const argv = require('yargs').argv;
const jade = require('gulp-jade');
const templateCache = require('gulp-angular-templatecache');

gulp.task('build:lint', () =>
    gulp.src([ 'gulpfile.js/**/*.js', 'config.js', 'server/**/*.js', 'src/**/*.js', 'bin/server' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)));

gulp.task('build:common:jade', () =>
    gulp.src('src/common/client/**/*.jade')
        .pipe(jade({
            pretty: argv.production ? false : true
        }))
        .pipe(gulp.dest('build/common')));

gulp.task('build:common:angular', [ 'build:lint', 'build:common:jade' ], () =>
    gulp.src([ 'build/common/**/*.html' ])
        .pipe(templateCache({
            root: './',
            module: '27th.common.templates',
            standalone: true
        }))
        .pipe(gulp.dest('build/common/')));
