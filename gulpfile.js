'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jsdoc = require('gulp-jsdoc3');


gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: 'http://localhost:5000/static',
        files: ['public/**/*.*'],
        browser: 'google chrome',
        port: 7000
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'index.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['!public/docs/**', 'public/**/*.js' ], ['jsdoc']);
});

gulp.task('jsdoc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md', 'public/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('default', ['browser-sync', 'watch', 'jsdoc'], function () {
});
