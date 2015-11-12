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
var merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');

var argv = require('yargs').argv;
var gif = require('gulp-if');

gulp.task('build:acmi:lint', function() {
    return gulp.src([ 'Gulpfile.js', 'config.js', 'server/**/*.js', 'src/client/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('build:acmi:sass', function() {
    return gulp.src([ 'src/acmi/sass/app.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/acmi'));
});

gulp.task('build:acmi:jade', function() {
    var templates = gulp.src('src/acmi/client/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build/acmi'));

    var index = gulp.src('src/acmi/index.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist/acmi'));

    return merge(templates, index);
});

gulp.task('build:acmi:angular', [ 'build:acmi:lint', 'build:acmi:jade' ], function() {
    return gulp.src([ 'build/acmi/**/*.html'])
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
        .pipe(gif(argv.production, ngAnnotate()))
        .pipe(gif(argv.production, uglify()))
        .pipe(gulp.dest('dist/acmi'));
});

gulp.task('build:acmi', [ 'build:acmi:lint', 'build:acmi:sass', 'build:acmi:browserify' ]);
gulp.task('watch:acmi', function () {
    gulp.watch([
        'src/acmi/client/**/*.jade',
        'src/acmi/client/**/*.js'
    ], [ 'build:acmi:browserify' ]);
    gulp.watch('src/acmi/index.jade', [ 'build:acmi:jade' ]);
    gulp.watch('src/acmi/sass/**/*.sass', [ 'build:acmi:sass' ]);
});
