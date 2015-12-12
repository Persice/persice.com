var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var csslint = require('gulp-csslint');

var jsFiles = [
'./src/public/lib/es6-shim.js',
'./src/public/lib/jquery-2.1.4.min.js',
'./src/public/lib/jstz.js',
'./src/public/lib/jquery.minimalect.js',
'./src/public/lib/circle-progress.js',
'./src/public/lib/svg4everybody.js',
'./src/public/lib/ion.rangeSlider.js',
'./src/public/lib/imgLiquid.js',
'./src/public/lib/jquery.dotdotdot.js',
'./src/public/lib/slick.js',
'./src/public/lib/remodal.js',
'./src/public/lib/picker.js',
'./src/public/lib/picker.date.js',
'./src/public/lib/picker.time.js',
'./src/public/lib/jquery.matchHeight.js',
'./src/public/lib/typeahead.js',
'./src/public/lib/tokenfield.js',
'./src/public/lib/jqueryui/core.js',
'./src/public/lib/jqueryui/widget.js',
'./src/public/lib/jqueryui/mouse.js',
'./src/public/lib/jqueryui/position.js',
'./src/public/lib/jqueryui/menu.js',
'./src/public/lib/jqueryui/autocomplete.js',
'./src/public/lib/jqueryui/sortable.js',
'./src/public/lib/jqueryui/draggable.js',
'./src/public/lib/tag-it.js',
'./src/public/js/init.js',
];

var cssFiles = [
'./src/public/css/ion.rangeSlider.css',
'./src/public/css/ion.rangeSlider.skinNice.css',
'./src/public/css/remodal.css',
'./src/public/css/remodal-default-theme.css',
'./src/public/css/classic.css',
'./src/public/css/classic.date.css',
'./src/public/css/classic.time.css',
'./src/public/css/tokenfield.css',
'./src/public/css/tokenfield-typeahead.css',
'./src/public/css/jquery.tagit.css',
'./src/public/css/tagit.ui-zendesk.css',
'./src/public/css/screen.css',
'./src/app/components/app.css'
];

gulp.task('js', function() {
  gulp.src(jsFiles)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./src/public/lib/'))
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
  .pipe(gulp.dest('./src/public/css/'))
});

gulp.task('css-lint', function() {
  gulp.src(cssFiles)
  .pipe(csslint())
  .pipe(csslint.reporter());
});

gulp.task('default', ['js', 'css']);
gulp.task('js-lint', ['jshint', 'jscs']);

