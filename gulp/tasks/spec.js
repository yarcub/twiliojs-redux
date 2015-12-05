var gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha'),
    config = require('../config').spec;

gulp.task('spec', function(){
  return gulp.src(config.src, {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function(err){
          gutil.log(err);
          this.emit('end');
        });
});
