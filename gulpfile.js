var gulp        = require('gulp');
var cleanCSS    = require('gulp-clean-css');
var concatCss   = require('gulp-concat-css');
var watch       = require('gulp-watch');
var uglify      = require('gulp-uglifyjs');

gulp.task('cssmin', function(done) {
  return gulp.src('css/app.css').pipe(concatCss("app.min.css")).pipe(cleanCSS({compatibility: 'ie8'})).pipe(gulp.dest('css/min'));
});

gulp.task('uglifyjs', function(done) {
    return gulp.src('js/app.js').pipe(uglify()).pipe(gulp.dest('js/min'))
});

gulp.task('watch', function(done) {
  gulp.watch('css/app.css', gulp.series('cssmin'));
  gulp.watch('js/app.js', gulp.series('uglifyjs'));
});


gulp.task('default', gulp.series( ['cssmin', 'uglifyjs', 'watch'], function(done) {
}));
