'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var paths = gulp.paths;

function runTests(singleRun, done) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  // console.log(bowerDeps);

  var testFiles = bowerDeps.js.concat([
    paths.src + '/app/index.js',
    paths.src + '/app/services.js',
    paths.src + '/app/app.controller.js',
    paths.src + '/app/**/*.js',
    paths.src + '/components/**/*.js',
    'test/unit/*.js',
  ]);


  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun) ? 'run' : 'watch'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

gulp.task('test', function(done) {
  runTests(true /* singleRun */ , done);
});
gulp.task('test:auto', function(done) {
  runTests(false /* singleRun */ , done);
});