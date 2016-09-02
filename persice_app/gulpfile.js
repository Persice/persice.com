var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var HOST = 'localhost:3002';

var jsFiles = [
  './lib/js/jquery-2.1.4.min.js',
  './lib/js/jstz.js',
  './lib/js/croppie.js',
  './lib/js/jquery.minimalect.js',
  './lib/js/jquery.matcheight.js',
  './lib/js/ion.rangeSlider.js',
  './lib/js/swiper.js',
  './lib/js/remodal.js',
  './lib/js/picker.js',
  './lib/js/picker.date.js',
  './lib/js/picker.time.js',
  './lib/js/typeahead.js',
  './lib/js/tokenfield.js',
  './lib/js/dragula.js'
];

var jsFilesMobile = [
  './lib/js/jquery-2.1.4.min.js',
  './lib/js/jstz.js',
  './lib/js/croppie.js',
  './lib/js/swiper.js',
  './lib/js/jquery.minimalect.js',
  './lib/js/ion.rangeSlider.js',
  './lib/js/viewport-units-buggyfill.js',
  './lib/js/remodal.js',
  './lib/js/typeahead.js',
  './lib/js/init-mobile.js',
  './lib/js/fakeLocalStorage.js'
];

var cssFilesAll = [
  './src/assets/css/mobile.css',
  './src/assets/css/app-mobile.css',
  './src/assets/css/screen.css',
  './src/assets/css/app.css'
];

var cssFiles = [
  './src/assets/css/screen.css',
  './src/assets/css/app.css'
];

var cssFilesMobile = [
  './src/assets/css/mobile.css',
  './src/assets/css/app-mobile.css',
];

gulp.task('js', function() {
  gulp.src(jsFiles)
    .pipe(concat('plugins.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./src/assets/js/'))
});

gulp.task('js-mobile', function() {
  gulp.src(jsFilesMobile)
    .pipe(concat('plugins-mobile.min.js'))
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
    .pipe(concat('vendor.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./src/assets/css/'))
});

gulp.task('css-mobile', function() {
  gulp.src(cssFilesMobile)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.mobile.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./src/assets/css/'))
});

gulp.task('css-lint', function() {
  gulp.src(cssFilesAll)
    .pipe(csslint())
    .pipe(csslint.reporter());
});



gulp.task('watch', function(gulpCallback) {
  browserSync.init({
    port: 3002,
    socket: {
      domain: HOST
    },
    // serve out of app/
    server: './src/assets',
    // launch default browser as soon as server is up
    open: false
  }, function callback() {
    // (server is now up)

    // watch css and stream to BrowserSync when it changes
    gulp.watch(cssFilesAll, function() {
      gulp.src(cssFilesAll)
        .pipe(browserSync.stream());
    });

    // notify gulp that this task is done
    gulpCallback();
  });
});


gulp.task('default', ['js', 'js-mobile', 'css', 'css-mobile']);
gulp.task('js-lint', ['jshint', 'jscs']);
