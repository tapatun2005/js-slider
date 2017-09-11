// Paths
var dest = "build/";
var source = "source/";

var gulp = require("gulp");

// Plugins
var argv = require('yargs').boolean('production').argv;
var sass = require("gulp-sass");
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require("browser-sync").create();
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var gcmq = require('gulp-group-css-media-queries');
var shorthand = require('gulp-shorthand');
var gzip = require('gulp-gzip');
var sourcemaps = require('gulp-sourcemaps');
var gs = require('gulp-selectors');

// Variables
var isProd = !!argv.production;
var isDev = !isProd;



// Tasks

gulp.task('default', ['compile', 'watch', 'server']);
gulp.task('compile', ['template','sass']);

gulp.task('template', function(){
	gulp.src(source + "index.html")
	.pipe(gulp.dest(dest));
})


gulp.task('sass', ["sass-desktop"]);

gulp.task("sass-desktop", function(){	
	
	gulp.src(source + "scss/styles.scss")
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpif(isProd, cssnano()))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
		.pipe(gulpif(isDev,sourcemaps.write('.')))
		.pipe(rename("app.css"))
		.pipe(gulp.dest(dest + "css/"));
});

gulp.task ("watch", ["server"], function() {
	gulp.watch(source + 'scss/*.scss', ['sass-desktop']).on('change', browserSync.reload);
	gulp.watch(source + '*.html', ['template']).on('change', browserSync.reload);
	gulp.watch(source + 'js/*.js', ['scripts']).on('change', browserSync.reload);
});


gulp.task('scripts', function() {
  return gulp.src(source +'js/*.js')
  	.pipe(babel({
            presets: ['es2015']
    }))
	.pipe(concat('slider.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(dest + 'js/'));
});

gulp.task("server", function(){
	browserSync.init({
		server: {
            baseDir: "./build/"
        }
	})
});