/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var config = {
    buildDir: './dist',
    jsMain: './src/wiggle-dist.js',
    jsMin: './wiggle.js',
};


function bundle () {
    return browserify({
        entries: config.jsMain,
        //debug: true,
    })
    .bundle()
    .pipe(source(config.jsMin))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(config.buildDir));
}

gulp.task('js', bundle);

