"use strict"

let path = require('path')
var fs = require('fs');


//var gulp = require("gulp");
//var babel = require("gulp-babel");

//gulp.task("default", function () {
//    return gulp.src("openorange/src/**/ormutils.es6")
//        .pipe(babel())
//        .pipe(gulp.dest(function(file) {
//            return file.base;
//        }));
//});

var gulp = require("gulp");
var print = require('gulp-print');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var sass = require('gulp-sass');




var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
//var concat = require("gulp-concat");


var gulp_src = gulp.src;
gulp.src = function () {
    return gulp_src.apply(gulp, arguments)
        .pipe(plumber(function (error) {
                // Output an error message
                gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
                // emit the end event, to properly end the task
                this.emit('end');
            })
        )
        .pipe(cache('processing'))
        .pipe(print());
};

gulp.task('watch', ['oo-watch', 'ui-watch', 'sd-watch']);

gulp.task('oo-watch', function () {
    gulp.watch('openorange/src/**/*.es6', ['oo-babel']);
    gulp.watch('openorange/src/**/*.js', ['oo-js']);
});

gulp.task('ui-watch', function () {
    let watcher;
    watcher = gulp.watch('openorange/ui/src/**/*.es6', ['ui-babel']);
    watcher = gulp.watch('openorange/ui/src/**/*.js', ['ui-js']);
    gulp.watch('openorange/ui/css/**/*.scss', ['ui-sass']);
    //watcher = gulp.watch('openorange/ui/src/**/*.js');
    watcher.on('change', function (event) {
        console.log("EVENT: ", event.type)
        if (event.type === 'deleted') {
            // Simulating the {base: 'src'} used with gulp.src in the scripts task
            var filename = path.join(path.dirname(event.path), "../js/oo", path.basename(event.path))
            // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
            fs.unlinkSync(filename);
        }
    });
});

gulp.task('sd-watch', function () {
    gulp.watch('scriptdirs/src/**/*.es6', ['sd-babel']);
    gulp.watch('scriptdirs/src/**/*.js', ['sd-js']);
});

gulp.task("oo-babel", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("openorange/src/**/*.es6")
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                let idx = file.path.lastIndexOf(fr);
                file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
                return file.base;
            }
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task("oo-js", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("openorange/src/**/*.js")
        .pipe(gulp.dest(function (file) {
            let idx = file.path.lastIndexOf(fr);
            file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
            return file.base
        }));
});


gulp.task("ui-babel", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("openorange/ui/src/*.es6")
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(function (file) {
            return path.join(file.base, "../js/oo")
        }));
});

gulp.task("ui-js", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("openorange/ui/src/*.js")
        .pipe(gulp.dest(function (file) {
            return path.join(file.base, "../js/oo")
        }));
});

gulp.task("ui-sass", function () {
    return gulp_src('openorange/ui/css/custom/templates.scss')
        .pipe(print())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('openorange/ui/css/'));
});

gulp.task("sd-babel", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("scriptdirs/src/**/*.es6")
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                let idx = file.path.lastIndexOf(fr);
                file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
                return file.base;
            }
        }))
        .pipe(gulp.dest(function (file) {
            //let idx = file.path.lastIndexOf(fr);
            //file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
            return file.base;
        }));
});

gulp.task("sd-js", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("scriptdirs/src/**/*.js")
        .pipe(gulp.dest(function (file) {
            let idx = file.path.lastIndexOf(fr);
            file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
            return file.base
        }));
});

gulp.task('create-openorange-symlink', () => {
    if (!fs.existsSync('node_modules/openorange')) fs.symlinkSync('../openorange/', 'node_modules/openorange');
})

gulp.task('init-project', ['build', 'create-openorange-symlink', 'sync-tables'], function () {

});

gulp.task('clean-oo', () => {
    return del.sync(['openorange/lib/**/*']);
})
gulp.task('clean-sd', () => {
    return del.sync(['scriptdirs/lib/**/*']);
})
gulp.task('clean-ui', () => {
    return del.sync(['openorange/ui/js/oo/**/*']);
})

gulp.task('clean-all', ['clean-oo', 'clean-sd','clean-ui'])


gulp.task('build', ['clean-all', 'oo-babel', 'oo-js', 'ui-js', 'ui-babel', 'ui-sass', 'sd-babel', 'sd-js'])

gulp.task('prepare openorange', () => {
    require('source-map-support').install(); //solo debe usarse para debugging
    require("babel-polyfill");
    global.__main__ = module
})

gulp.task('sync-tables', ['prepare openorange'], () => {
    let oo = require("openorange")
    oo.init();
    oo.orm.syncAllTables()
        .then(function () {
            console.log("Sync tables finished")
            oo.finish()
        })
})


gulp.task('create-openorange-user', ['prepare openorange'], () => {
    let oo = require("openorange")
    oo.init();
    var conn = null;
    oo.getDBConnection()
        .then((newconn) => {
            conn = newconn
            return conn.query("INSERT into User (Code) values (?)", ['openorange'])
        })
        .then(() => {
            return conn.commit()
        })
        .then(() => {
            gutil.log(gutil.colors.green('User openorange (no password) is now available for login'));
            oo.finish();
        })
        .catch((err) => {
            gutil.log(gutil.colors.red(err));
            oo.finish();
        })
})

function P() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log("EN TIMEOUT")
            resolve("OK")
        }, 2000);
    });
}
gulp.task("TEST", ['prepare openorange'], () => {
    let oo = require("openorange")
    oo.init();
    oo.getDBConnection()
    console.log("EN TEST")
  P()
      .then((res) => {console.log(res); oo.finish()})
})

//gulp.task('minify-css', function() {
//    fs.unlinkSync('openorange/ui/css/app/styles.min.css');
//    return gulp.src('openorange/ui/css/app/**/*.css')
//        .pipe(cleanCSS())
//        .pipe(concat('styles.min.css'))
//        .pipe(gulp.dest((file) => {return file.base}));
//});
