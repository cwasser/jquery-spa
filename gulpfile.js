var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var map = require('map-stream');
var qunit = require('node-qunit-phantomjs');

var DEST = './dist/';
var PATHS = {
    scripts: ['./src/**/*.js'],
    test: './test/jquery.spa.html'
};

var logTime = function(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();

    return '[' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ']: ';
};

gulp.task('default',['clean','jshint','test','build'], function(){
    return gutil.log('clean and build successfully finished');
});

gulp.task('build', function(){
   return gulp.src(PATHS.scripts)
       .pipe(concat('jquery.spa.js'))
       .pipe(sourcemaps.init())
       .pipe(gulp.dest(DEST))
       .pipe(uglify())
       .pipe(rename({ extname: '.min.js' }))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(DEST));
});

gulp.task('jshint',function(){
    return gulp.src(PATHS.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(map(function exitOnJsHintFail(file, cb){
            if(!file.jshint.success) {
                console.error(logTime() + 'Error! jshint check failed');
                process.exit();
            }
        }));
});

gulp.task('test', function(){
    //Implement a proper phantomjs testcase later on, for now: Deactivate tests
    //qunit(PATHS.test, { 'verbose': true});
});

gulp.task('watch', function(){
    console.log(logTime() + 'Start watching JS sources and check them with jshint');
    gulp.watch(PATHS.scripts, function(event){
        console.log(logTime() + 'File ' + event.path + ' was ' + event.type + ', checking with jshint...');
        return gulp.src(PATHS.scripts)
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
    return del('dist/*');
});
