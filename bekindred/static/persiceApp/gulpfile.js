var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var csslint = require('gulp-csslint');

var jsFiles = [
'./src/assets/lib/es6-shim.js',
'./src/assets/lib/jquery-2.1.4.min.js',
'./src/assets/lib/jstz.js',
'./src/assets/lib/jquery.minimalect.js',
'./src/assets/lib/circle-progress.js',
'./src/assets/lib/svg4everybody.js',
'./src/assets/lib/ion.rangeSlider.js',
'./src/assets/lib/imgLiquid.js',
'./src/assets/lib/jquery.dotdotdot.js',
'./src/assets/lib/slick.js',
'./src/assets/lib/remodal.js',
'./src/assets/lib/picker.js',
'./src/assets/lib/picker.date.js',
'./src/assets/lib/picker.time.js',
'./src/assets/lib/jquery.matchHeight.js',
'./src/assets/lib/typeahead.js',
'./src/assets/lib/tokenfield.js',
'./src/assets/lib/jqueryui/core.js',
'./src/assets/lib/jqueryui/widget.js',
'./src/assets/lib/jqueryui/mouse.js',
'./src/assets/lib/jqueryui/position.js',
'./src/assets/lib/jqueryui/menu.js',
'./src/assets/lib/jqueryui/autocomplete.js',
'./src/assets/lib/jqueryui/sortable.js',
'./src/assets/lib/jqueryui/draggable.js',
'./src/assets/lib/tag-it.js',
'./src/assets/js/init.js',
];

var cssFiles = [
'./src/assets/css/ion.rangeSlider.css',
'./src/assets/css/ion.rangeSlider.skinNice.css',
'./src/assets/css/remodal.css',
'./src/assets/css/remodal-default-theme.css',
'./src/assets/css/classic.css',
'./src/assets/css/classic.date.css',
'./src/assets/css/classic.time.css',
'./src/assets/css/tokenfield-typeahead.css',
'./src/assets/css/jquery.tagit.css',
'./src/assets/css/tagit.ui-zendesk.css',
'./src/assets/css/screen.css',
'./src/assets/css/app.css'
];

gulp.task('js', function() {
  gulp.src(jsFiles)
  .pipe(concat('plugins.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./src/assets/lib/'))
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
  .pipe(minifyCSS())
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('./src/assets/css/'))
});

gulp.task('css-lint', function() {
  gulp.src(cssFiles)
  .pipe(csslint())
  .pipe(csslint.reporter());
});

gulp.task('default', ['js', 'css']);
gulp.task('js-lint', ['jshint', 'jscs']);
