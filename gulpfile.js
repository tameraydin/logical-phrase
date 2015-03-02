// gulp node modules
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var istanbul = require('gulp-istanbul');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var header = require('gulp-header');

// node modules
var del = require('del');
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');

// package.json
var pkg = require('./package');
var jshintConfig = pkg.jshintConfig;
var banner = [
    '/**',
    ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author %>',
    ' * Licensed under <%= pkg.license %> (http://tameraydin.mit-license.org/)',
    ' */',
    ''
  ].join('\n');

var PATH = {
  SOURCE: './src/',
  TEST: './test/',
  DIST: './dist/'
};

gulp.task('clean', function(cb) {
  del([PATH.DIST], cb);
});

jshintConfig.lookup = false;
gulp.task('jshint', function() {
  return gulp.src(PATH.SOURCE + '*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function() {
  return gulp.src(PATH.TEST + '*.spec.js')
    .pipe(jasmine());
});

gulp.task('coverage', function(cb) {
  gulp.src(PATH.SOURCE + '*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(PATH.TEST + '*.spec.js')
        .pipe(jasmine())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('copy', function() {
  return gulp.src(PATH.SOURCE + '*.js')
    .pipe(rename({
      basename: pkg.name
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('uglify', function() {
  return gulp.src(PATH.SOURCE + '*.js')
    .pipe(uglify())
    .pipe(rename({
      basename: pkg.name,
      suffix: '.min'
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('banner', function() {
  return gulp.src(PATH.DIST + '*.js')
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('watch', function() {
  gulp.watch(PATH.SOURCE + '*.js', ['jshint']);
});

gulp.task('autotest', function() {
  gulp.watch(PATH.SOURCE + '*.js', ['jshint', 'test']);
  gulp.watch(PATH.TEST + '*.spec.js', ['test']);
});

gulp.task('build', ['clean'], function(cb) {
  runSequence(
    'jshint',
    'coverage',
    'copy',
    'uglify',
    'banner',
    cb);
});

gulp.task('default', ['build']);
