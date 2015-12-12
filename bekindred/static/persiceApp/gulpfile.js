
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('minifyscripts', function() {
  gulp.src([
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
   ])
.pipe(concat('vendor.min.js'))
.pipe(uglify())
.pipe(gulp.dest('./src/public/lib/'))
});

gulp.task('default', ['minifyscripts']);
