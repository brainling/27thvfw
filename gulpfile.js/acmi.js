'use strict';

const gulp = require('gulp');
gulp.if = require('gulp-if');

const jshint = require('gulp-jshint');
const browserify = require('browserify');
const stylish = require('jshint-stylish');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
const jade = require('gulp-jade');
const templateCache = require('gulp-angular-templatecache');
const merge = require('merge-stream');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const argv = require('yargs').argv;
const rename = require('gulp-rename');


gulp.task('build:acmi:lint', () =>
    gulp.src([ 'gulpfile.js/**/*.js', 'config.js', 'server/**/*.js', 'src/**/*.js', 'bin/server' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)));

gulp.task('build:acmi:sass', () =>
    gulp.src([ 'src/acmi/sass/app.sass' ])
        .pipe(sass({
            outputStyle: argv.production ? 'compressed' : 'nested'
        }).on('error', sass.logError))
        .pipe(gulp.if(argv.production, rename('app.min.css')))
        .pipe(gulp.dest('dist/acmi')));

gulp.task('build:acmi:jade', () => {
    let templates = gulp.src('src/acmi/client/**/*.jade')
        .pipe(jade({
            pretty: argv.production ? false : true
        }))
        .pipe(gulp.dest('build/acmi'));

    let index = gulp.src('src/acmi/index.jade')
        .pipe(jade({
            pretty: argv.production ? false : true,
            locals: {
                appCss: argv.production ? 'app.min.css' : 'app.css',
                appJs: argv.production ? 'app.min.js' : 'app.js'
            }
        }))
        .pipe(gulp.if(argv.production, rename('index.min.html')))
        .pipe(gulp.dest('dist/acmi'));

    return merge(templates, index);
});

gulp.task('build:acmi:angular', [ 'build:acmi:lint', 'build:acmi:jade' ], () =>
    gulp.src([ 'build/acmi/**/*.html' ])
        .pipe(templateCache({
            root: './',
            module: '27th.templates',
            standalone: true
        }))
        .pipe(gulp.dest('build/acmi/')));

gulp.task('build:acmi:browserify', [ 'build:acmi:lint', 'build:acmi:angular' ], () =>
    browserify('src/acmi/client/app.js')
        .require('./build/acmi/templates.js', { expose: 'templates' })
        .transform('babelify', { presets: [ 'es2015' ] })
        .bundle()
        .pipe(gulp.if(argv.production, source('app.min.js'), source('app.js')))
        .pipe(buffer())
        .pipe(gulp.if(argv.production, ngAnnotate()))
        .pipe(gulp.if(argv.production, uglify()))
        .pipe(gulp.dest('dist/acmi')));

gulp.task('build:acmi', [ 'build:acmi:lint', 'build:acmi:sass', 'build:acmi:browserify' ]);
gulp.task('watch:acmi', () => {
    gulp.watch([
        'src/acmi/client/**/*.jade',
        'src/acmi/client/**/*.js'
    ], [ 'build:acmi:browserify' ]);
    gulp.watch('src/acmi/index.jade', [ 'build:acmi:jade' ]);
    gulp.watch('src/acmi/sass/**/*.sass', [ 'build:acmi:sass' ]);
});
