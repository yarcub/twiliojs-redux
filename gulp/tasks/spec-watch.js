var gulp = require('gulp'),
    config = require('../config').spec;

gulp.task('spec-watch', function(){
  gulp.watch(config.watch_src, ['spec']);
});
