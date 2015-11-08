'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var stylish = require('jshint-stylish');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var templateCache = require('gulp-angular-templatecache');

gulp.task('build:acmi:lint', function() {
    gulp.src([ 'Gulpfile.js', 'config.js', 'server/**/*.js', 'src/client/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('build:acmi:sass', function() {
    gulp.src([ 'src/acmi/sass/app.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/acmi'));
});

gulp.task('build:acmi:jade', function() {
    gulp.src('src/acmi/client/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build/acmi'));

    gulp.src('src/acmi/index.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist/acmi'));
});

gulp.task('build:acmi:angular', [ 'build:acmi:lint', 'build:acmi:jade' ], function() {
    gulp.src([ 'build/acmi/**/*.html'])
        .pipe(templateCache({
            root: './',
            module: '27th.templates',
            standalone: true
        }))
        .pipe(gulp.dest('build/acmi/'));
});

gulp.task('build:acmi:browserify', [ 'build:acmi:lint', 'build:acmi:angular' ], function() {
    return browserify('src/acmi/client/app.js')
        .require('./build/acmi/templates.js', { expose: 'templates' })
        .transform('babelify', { presets: [ 'es2015' ]})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/acmi'));
});

gulp.task('build:acmi', [ 'build:acmi:lint', 'build:acmi:sass', 'build:acmi:browserify' ]);
