'use strict';

var gulp = require('gulp'),
    livereload = require('gulp-livereload');

var paths = gulp.paths;

gulp.task('livereload', function() {
    livereload.listen();
    gulp.watch([
        paths.src + '/**/*.html',
        paths.src + '/{app,components}/**/*.scss',
        paths.src + '/{app,components}/**/*.js',
        'bower.json'
    ]).on('change', function(file) {
        livereload.changed(file.path);
    });
});
