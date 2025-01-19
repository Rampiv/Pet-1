const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const image = require('gulp-image');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const sass = require('gulp-sass')(require('sass'));


/**
 * Dev check
 */
const isDev = function () {
  return !argv.prod;
}

/**
* Prod check
*/
const isProd = function () {
  return !!argv.prod;
}


const clean = () => {
  return del(['dist/*'])
}

const styles = () => {
  return src('./src/style/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(isDev(), sourcemaps.init()))
    .pipe(gulpif(isProd(), autoprefixer({
      cascade: false,
    })))
    .pipe(concat('main.css'))
    .pipe(gulpif(isProd(), cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev(), sourcemaps.write('.')))
    .pipe(dest('./dist/style/'))
    .pipe(browserSync.stream());
};

const scripts = () => {
  return src(
    ['./src/js/components/**.js', './src/js/main.js'])
    .pipe(gulpif(isDev(), sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulpif(isProd(), uglify({
      toplevel: true
    }).on("error", notify.onError())))
    .pipe(gulpif(isDev(), sourcemaps.write('.')))
    .pipe(dest('./dist/js'))
    .pipe(browserSync.stream());
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./dist/resources'))
}

const images = () => {
  return src([
    './src/img/**.jpg',
    './src/img/**.png',
    './src/img/**.jpeg',
    './src/img/**/*.svg',
    './src/img/**/*.jpg',
    './src/img/**/*.png',
    './src/img/**/*.jpeg',
    './src/img/**/*.webp'
  ])
    .pipe(gulpif(isProd(), image()))
    .pipe(dest('./dist/img'))
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
  });

  watch('./src/*.html', htmlMinify);
  watch('./src/style/**/*.scss', styles);
  watch('./src/img/*.{jpg,jpeg,png,svg}', images);
  watch('./src/img/**/*.{jpg,jpeg,png}', images);
  watch('./src/js/**/*.js', scripts);
  watch('./src/resources/**', resources);
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

exports.styles = styles;

exports.htmlMinify = htmlMinify;


exports.default = series(clean, scripts, styles, resources, images, htmlMinify, watchFiles);
