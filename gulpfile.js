const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm' );
const sass = require('gulp-sass')(require('dart-sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require("gulp-svgo");
const svgSprite = require("gulp-svg-sprite");
const gulpif = require("gulp-if");

const env = process.env.NODE_ENV;

const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require("./gulp.config");

task('clean', () => {
    return src(`${DIST_PATH}/**/*`, {read: false}).pipe(rm());
});

task("copy:html",() => {
    return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({stream: true}));
});

task("copy:png",() => {
    return src(`${SRC_PATH}/images/**/*.png`)
    .pipe(dest(`${DIST_PATH}/images`))
});

task("copy:jpg",() => {
    return src(`${SRC_PATH}/images/**/*.jpg`)
    .pipe(dest(`${DIST_PATH}/images`))
});

task("copy:video",() => {
    return src(`${SRC_PATH}/video/*.*`)
    .pipe(dest(`${DIST_PATH}/video`))
});

task("copy:svg",() => {
    return src(`${SRC_PATH}/images/**/*.svg`)
    .pipe(dest(`${DIST_PATH}/images`))
});

task("styles", () => {
    return src([...STYLES_LIBS, `${SRC_PATH}/scss/main.scss`])
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat("main.scss"))
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        // .pipe(px2rem())
        .pipe(
            gulpif(
                env === 'dev',
                autoprefixer({browsers: ["last 2 versions"],cascade: false })
            )
        )
        .pipe(gulpif(env === 'prod', gcmq()))
        .pipe(gulpif(env === 'prod', cleanCSS()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/css`))
        .pipe(reload({stream: true}));
});

task("scripts", () => {
    return src([...JS_LIBS, `${SRC_PATH}/scripts/*.js`])
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat("main.js", {newLine: ";"}))
        .pipe(gulpif(env === 'prod', babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/scripts`))
        .pipe(reload({stream: true}));
});

task("icons", () => {
    return src(`${SRC_PATH}/images/icons/*.svg`)
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: { attrs: "(fill|stroke|style|width|height|data.*)" }
                }
            ]
        })
    )
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../sprite.svg"
            }
        }
    }))
    .pipe(dest(`${DIST_PATH}/images`));
});

task('server', () => {
    browserSync.init({
        server: {
            baseDir: `./${DIST_PATH}`
        },
        open: false
    });
});

task ("watch", () => {
    watch(`./${SRC_PATH}/scss/**/*.scss`, series("styles"));
    watch(`./${SRC_PATH}/*.html`, series("copy:html"));
    watch(`./${SRC_PATH}/scripts/*.js`, series("scripts"));
    watch(`./${SRC_PATH}/images/icons/*.svg`, series("icons"));
});

task(
    "default",
    series(
        "clean", 
        parallel("copy:html", "copy:png", "copy:jpg", "copy:video", "copy:svg", "styles", "scripts", "icons"),
        parallel("watch", 'server')
    )
);

task(
    "build",
    series(
        "clean", 
        parallel("copy:html","copy:png", "copy:jpg", "copy:video", "copy:svg", "styles", "scripts", "icons")
    )
);