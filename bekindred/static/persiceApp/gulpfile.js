var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');

var jsFiles = [
  './lib/js/es6-shim.js',
  './lib/js/jquery-2.1.4.min.js',
  './lib/js/jstz.js',
  './lib/js/jquery.minimalect.js',
  './lib/js/circle-progress.js',
  './lib/js/svg4everybody.js',
  './lib/js/ion.rangeSlider.js',
  './lib/js/jquery.dotdotdot.js',
  './lib/js/swiper.js',
  './lib/js/remodal.js',
  './lib/js/picker.js',
  './lib/js/picker.date.js',
  './lib/js/picker.time.js',
  './lib/js/jquery.matchHeight.js',
  './lib/js/typeahead.js',
  './lib/js/tokenfield.js',
  './lib/js/jqueryui/core.js',
  './lib/js/jqueryui/widget.js',
  './lib/js/jqueryui/mouse.js',
  './lib/js/jqueryui/position.js',
  './lib/js/jqueryui/menu.js',
  './lib/js/jqueryui/autocomplete.js',
  './lib/js/jqueryui/sortable.js',
  './lib/js/jqueryui/draggable.js',
  './lib/js/tag-it.js',
  './lib/js/init.js',
];

var cssFiles = [
  './src/assets/css/screen.css',
  './src/assets/css/app.css'
];

gulp.task('js', function() {
  gulp.src(jsFiles)
    .pipe(concat('plugins.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./src/assets/js/'))
});

gulp.task('jshint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(jsFiles)
    .pipe(jscs({
      configPath: '.jscs.json'
    }));
});

gulp.task('css', function() {
  gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(concat('vendor.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/assets/css/'))
});

gulp.task('css-lint', function() {
  gulp.src(cssFiles)
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('default', ['js', 'css']);
gulp.task('js-lint', ['jshint', 'jscs']);
