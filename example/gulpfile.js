var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');

var config = {
  entryFile: './src/app/app.js',
  htmlFiles: './src/www/**/*',
  outputDir: './build/',
  outputFile: 'app.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = browserify(config.entryFile, { debug: true });
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { gutil.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build', ['html'], function() {
  return bundle();
});

gulp.task('html', ['clean'], function() {
  return gulp.src(config.htmlFiles)
    .pipe(gulp.dest(config.outputDir));
});

gulp.task('watch', function() {
  getBundler().on('update', function() {
    gulp.start('build')
  });
});
