var gulp = require('gulp'),
    typescript = require('gulp-tsc'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglifyjs');

gulp.task('Build library', function () {
   gulp.src('scripts/Routing/Annotations/route.ts', {read: false})
       .pipe(shell([
           'tsc <%= file.path %> --out routing.js'
       ]));
});

gulp.task('Minimize library', function () {
    gulp.src('routing.js')
        .pipe(uglify('routing.js', { mangle: true }))
        .pipe(gulp.dest(''))
});