const gulp = require('gulp');
const babel = require('gulp-babel');
const config = require('../config').build;

gulp.task('build',['lint','spec'], () => {
	return gulp.src('src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest(config.output));
});
