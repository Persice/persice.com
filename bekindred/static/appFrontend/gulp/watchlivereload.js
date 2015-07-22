'use strict';

var gulp = require('gulp'),
    livereload = require('gulp-livereload');

var paths = gulp.paths;

gulp.task('livereload', ['watch'], function() {
    livereload.listen();
    gulp.watch([
        paths.src + '/**/*.html',
        paths.tmp + '/serve/**/*.css',
        paths.src + '/{app,components}/**/*.js'
    ]).on('change', function(file) {
        livereload.changed(file.path);
    });
});
