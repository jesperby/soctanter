// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	shell = require('gulp-shell'),
	minifyCSS = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	iconify = require('gulp-iconify'),


// Lint Task
gulp.task('lint', function() {
	return gulp.src('assets/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Compress images
gulp.task('images', function () {
	return gulp.src('assets/img/**/*.*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest('build/img'));
});


// Compile Our Sass with Bundle[d] Compass
gulp.task('sass', function() {
	return gulp.src('assets/scss/main.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(sass())
		.pipe(gulp.dest('build/css'))
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/css'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src(['assets/js/lib/*.js','assets/js/*.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

// Run drush to clear the theme registry.
gulp.task('cc', shell.task([
	'drush cc all'
]));

// Create png backup and css for svg
gulp.task('icons', function() {
    return iconify({
        src: './assets/img/icon/*.svg',
        pngOutput: './build/img/icon/png/',
        scssOutput: './assets/scss/',
        cssOutput:  './build/css',
    });
});

// Watch Files For Changes
gulp.task('dev', function() {
	gulp.watch('./assets/js/**/*.js', ['lint', 'scripts']);
	gulp.watch('./assets/scss/**/*.scss', ['sass']);
	gulp.watch('./assets/img/**/*.*', ['images']);
	gulp.watch('./assets/scss/fonts/**/*.*', ['fonts']);
});


// Default Task
gulp.task('default', ['lint', 'sass', 'images', 'scripts']);
