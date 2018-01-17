const del = require('del');
const gulp = require('gulp');
const polymerBuildUtils = require('gulp-polymer-build-utils');
const runSequence = require('run-sequence');

gulp.task('default', cb => {
  return runSequence('dist:prepare', 'inline-references', cb);
});

gulp.task('dist:prepare', ['dist:clean'], () => {
  const config = require('./polymer.json');
  return polymerBuildUtils.build(config)()
    .pipe(gulp.dest('dist'));
});


gulp.task('dist:clean', () => del('dist'));
