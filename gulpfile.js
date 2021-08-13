const { gulp, src, dest, watch, parallel, series } = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    browserSync = require('browser-sync'),

    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),

    webp = require('gulp-webp'),

    del = require('del'),

    releaseFolder = "dist",
    sourceFolder = "src";


let path = {
    build: {
        html: + "/",
        css: releaseFolder + "/css/",
        js: releaseFolder + "/js/",
        img: releaseFolder + "/img/",
        fonts: releaseFolder + "/fonts/",
        sprites: releaseFolder + "/sprites/",
    },
    src: {
        html: sourceFolder + "/*.html",
        css: sourceFolder + "/*.css",
        js: sourceFolder + "/*.js",
        img: sourceFolder + "/Content/images/**/*.{jpg,png,webp}",
        fonts: sourceFolder + "/Content/fonts/*.ttf",
        sounds: sourceFolder + "/Content/sounds/*.mp3",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/**/*.css",
        js: sourceFolder + "/**/*.js",
        img: sourceFolder + "/Content/images/sprites/**/*.{jpg,png,webp}",
    },
    clean: "./" + releaseFolder + "/"
}


function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: sourceFolder }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function scripts() {
    return src([
    path.src.js,
    ])
    .pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}

function styles() {
    return src([
    path.src.css,
    ])
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({overrideBrowsersList: ['last 10 vesrions'], grid: true}))
    .pipe(cssnano())
    .pipe(dest(path.build.css))
}

function images() {
    return src([
    path.src.img,
    ])
    .pipe(webp())
    .pipe(dest(path.build.img))
}

function startwatch() {
    watch(path.watch.js,  scripts)
    watch(path.watch.img,  images)
    watch(path.watch.html).on('change', browserSync.reload);
}

async function clean() {
    return src(
        del(path.clean))
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.clean = clean;


exports.default = parallel(scripts, styles, images, browsersync, startwatch)
