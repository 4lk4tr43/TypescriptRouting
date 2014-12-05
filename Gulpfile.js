var gulp = require('gulp'),
    typescript = require('gulp-tsc'),
    uglify = require('gulp-uglifyjs');;

gulp.task('Build library', function () {
   gulp.src('scripts/Routing/Annotations/route.ts')
       .pipe(typescript({ target: 'ES5', out: 'routing.js'}))
       .pipe(uglify('routing.js', { mangle: true }))
       .pipe(gulp.dest(''))
});