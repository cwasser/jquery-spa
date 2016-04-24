'use strict';

/**
 * Import all plugins for gulp
 */
    // GULP
var gulp = require('gulp'),
    // GULP PLUGINS
    // utility functions for gulp
    gutil = require('gulp-util'),
    // rename a file
    rename = require('gulp-rename'),
    // uglify js for minimizing
    uglify = require('gulp-uglify'),
    // concat for concat all js files
    concat = require('gulp-concat'),
    // sourcemaps out of the browserify
    sourcemaps = require('gulp-sourcemaps'),
    // jshint checker for gulp, coding style
    jshint = require('gulp-jshint'),
    // tap for using callbacks for each file in the pipe
    tap = require('gulp-tap'),
    // EXTERNAL PLUGINS
    // delete something
    del = require('del'),
    map = require('map-stream'),
    // making AMD modules ready for the browser
    browserify = require('browserify'),
    // vinyl-source-stream to use the stream of non gulp plugins
    source = require('vinyl-source-stream'),
    // reactify
    reactify = require('reactify');


var DEST = './dist/',
    SRC_FILES = ['./src/spa/Util.js', './src/spa/Data.js', './src/spa/History.js', './src/spa/Router.js','./src/spa.js'],
    SRC_FILES_ALL = ['./src/**/*.js'],
    BROWSERIFY_OPTS = {
        entries : SRC_FILES,
        debug : true
    },
    VERSION = 'v0.4.0',
    TARGET_FILENAME = 'jquery.spa.js';

var logTime = function(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();

    return '[' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ']: ';
};

gulp.task('default',['clean','jshint','build'], function(){
    return gutil.log('clean and build successfully finished');
});

gulp.task('browserify', function(){
    var bundler = browserify(BROWSERIFY_OPTS),
        stream;
    bundler.transform(reactify);
    stream = bundler.bundle();

    return stream.on('error', gutil.log.bind(gutil, logTime() + ' Browserify Error'))
        .pipe(source(TARGET_FILENAME + '-' + VERSION))
        .pipe(gulp.dest(DEST));
});

gulp.task('build', ['browserify'],function(){
    return gulp.src([DEST + TARGET_FILENAME + '-' + VERSION])
        .pipe(gulp.dest(DEST))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEST));
});

gulp.task('jshint',function(){
    return gulp.src(SRC_FILES_ALL)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(map(function exitOnJsHintFail(file, cb){
            if(!file.jshint.success) {
                console.error(logTime() + 'Error! jshint check failed');
                process.exit();
            }
        }));
});

gulp.task('watch', function(){
    console.log(logTime() + 'Start watching JS sources and check them with jshint');
    gulp.watch(SRC_FILES_ALL, function(event){
        console.log(logTime() + 'File ' + event.path + ' was ' + event.type + ', checking with jshint...');
        return gulp.src(SRC_FILES_ALL)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(map(function showJsHintState(file, cb){
                if(!file.jshint.success) {
                    console.log(logTime() + 'Some files contain errors');
                } else {
                    console.log(logTime() + 'Everything looks good');
                }
            }));
    });
});

gulp.task('clean', function(){
    return del([DEST + '*']);
});
