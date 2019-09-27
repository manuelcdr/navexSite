"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
  // Font Awesome CSS
  var fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
    .pipe(gulp.dest('./vendor/fontawesome-free/css'));
  // Font Awesome Webfonts
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(gulp.dest('./vendor/fontawesome-free/webfonts'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery
  var jquery = gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ]).pipe(gulp.dest('./vendor/jquery'));

  return merge(bootstrap, fontAwesomeCSS, fontAwesomeWebfonts, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js',
      '!./js/contact_me.js',
      '!./js/jqBootstrapValidation.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
}


function wizard() {

  // js -----------------------------------------------------
  var js = gulp.src([
    './wizard-template/assets/**/*.js'
  ]).pipe(gulp.dest('./vendor/wizard/assets'));

  // imgs -----------------------------------------------------
  var imgs = gulp.src([
    './wizard-template/assets/**/*.jpg',
    './wizard-template/assets/**/*.png'
  ]).pipe(gulp.dest('./vendor/wizard/assets'));

  // css -----------------------------------------------------
  var css = gulp.src([
    './wizard-template/assets/**/*.css'
  ]).pipe(gulp.dest('./vendor/wizard/assets'));

  // scss -----------------------------------------------------
  var scss = gulp
    .src("./wizard-template/assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./vendor/wizard/assets/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./vendor/wizard/assets/css"))
    .pipe(browsersync.stream());

  // merge -----------------------------------------------------
  return merge(js, imgs, css);
}

function suggestags() {

  // js -----------------------------------------------------
  var js = gulp.src(['./node_modules/suggestags/js/**/*'])
    .pipe(gulp.dest('./vendor/suggestags/js'));

  // css -----------------------------------------------------
  var css = gulp.src(['./node_modules/suggestags/css/**/*'])
    .pipe(gulp.dest('./vendor/suggestags/css'));

  // merge -----------------------------------------------------
  return merge(js, css);
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
  gulp.watch(["./wizard-template/assets/**/*"], wizard);
  gulp.watch("./**/*.html", browserSyncReload);
}

function toDist() {
  del(["./_dist/*"]);
  
  var css = gulp.src('./css/**/*')
    .pipe(gulp.dest('./_dist/css'));

  var js = gulp.src('./js/**/*')
    .pipe(gulp.dest('./_dist/js'));

  var img = gulp.src('./img/**/*')
    .pipe(gulp.dest('./_dist/img'));

  var vendor = gulp.src('./vendor/**/*')
    .pipe(gulp.dest('./_dist/vendor'));

  var html = gulp.src('./*.html')
    .pipe(gulp.dest('./_dist'));

  return merge(css, js, img, vendor, html);
}

// Define complex tasks
const vendor = gulp.series(clean, modules, wizard, suggestags);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
const dist = gulp.series(build, gulp.parallel(css, js), toDist);

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.wizard = wizard;
exports.suggestags = suggestags;
exports.default = build;
exports.dist = dist;
