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

module.exports = function(name) {
    gulp.task(`build:${name}:sass`, () =>
        gulp.src([ `src/${name}/sass/app.sass` ])
            .pipe(sass({
                outputStyle: argv.production ? 'compressed' : 'nested'
            }).on('error', sass.logError))
            .pipe(gulp.if(argv.production, rename('app.min.css')))
            .pipe(gulp.dest(`dist/${name}`)));

    gulp.task(`build:${name}:jade`, () => {
        let templates = gulp.src(`src/${name}/client/**/*.jade`)
            .pipe(jade({
                pretty: argv.production ? false : true
            }))
            .pipe(gulp.dest(`build/${name}`));

        let index = gulp.src(`src/${name}/index.jade`)
            .pipe(jade({
                pretty: argv.production ? false : true,
                locals: {
                    appCss: argv.production ? 'app.min.css' : 'app.css',
                    appJs: argv.production ? 'app.min.js' : 'app.js'
                }
            }))
            .pipe(gulp.if(argv.production, rename('index.min.html')))
            .pipe(gulp.dest(`dist/${name}`));

        return merge(templates, index);
    });

    gulp.task(`build:${name}:angular`, [ 'build:common:angular', 'build:lint', `build:${name}:jade` ], () =>
        gulp.src([ `build/${name}/**/*.html` ])
            .pipe(templateCache({
                root: './',
                module: `27th.${name}.templates`,
                standalone: true
            }))
            .pipe(gulp.dest(`build/${name}/`)));

    gulp.task(`build:${name}:browserify`, [ 'build:lint', `build:${name}:angular` ], () =>
        browserify(`src/${name}/client/app.js`)
            .require(`./build/${name}/templates.js`, { expose: 'templates' })
            .require('./build/common/templates.js', { expose: 'templates-common' })
            .transform('babelify', { presets: [ 'es2015' ] })
            .bundle()
            .pipe(gulp.if(argv.production, source('app.min.js'), source('app.js')))
            .pipe(buffer())
            .pipe(gulp.if(argv.production, ngAnnotate()))
            .pipe(gulp.if(argv.production, uglify()))
            .pipe(gulp.dest(`dist/${name}`)));

    gulp.task(`build:${name}`, [ 'build:lint', `build:${name}:sass`, `build:${name}:browserify` ]);
    gulp.task(`watch:${name}`, () => {
        gulp.watch([
            `src/${name}/client/**/*.jade`,
            `src/${name}/client/**/*.js`
        ], [ `build:${name}:browserify` ]);
        gulp.watch(`src/${name}/index.jade`, [ `build:${name}:jade` ]);
        gulp.watch(`src/${name}/sass/**/*.sass`, [ `build:${name}:sass` ]);
    });
};
