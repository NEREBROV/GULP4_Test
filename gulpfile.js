const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const autoprefixer = require('gulp-autoprefixer')
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const newer = require('gulp-newer');

const del = require('del')


const paths = {
	html:{
		src: 'src/*.html',
		dest: 'dist'
	},
	styles: {
		src: 'src/styles/**/*.less',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/js/'
	},
	images: {
		src: 'src/img/*',
		dest: 'dist/img/'
	}
}

function clean() {
	return del(['dist/*', '!dist/img'])
}

function html() {
	return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(size())
    .pipe(gulp.dest(paths.html.dest));
}

function styles() {
	return gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		// Вызов препроцессора
		.pipe(less())
		.pipe(autoprefixer({
			cascade: false 
		}))
		// Минификация CSS
		.pipe(cleanCSS({
			level: 2
		}))
		// переименовываем (добавляем название) файл(а)
		.pipe(rename({
			basename: 'main',
			suffix: '.min'
		}))
		// Запись стилей в папку dist
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.styles.dest))
	}

function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.dest))
}

function img() {
	 return gulp.src(paths.images.src)
	 .pipe(newer('paths.images.dest'))	
	 .pipe(imagemin({
			progressive: true
		}))
		.pipe(size())
	 	.pipe(gulp.dest(paths.images.dest))
}

function watch() {
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scscripts =scripts
exports.watch = watch
exports.build = build
exports.default = build
