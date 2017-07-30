"use strict";
const del = require('del');
const gulp = require("gulp");
const babel = require('gulp-babel');
const shell = require('gulp-shell');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');

//-----------
// Tasks
//-----------
gulp.task("clean-node_modules", () => {
    return del("dist/node_modules");
});

gulp.task("clean", () => {
    return del(["dist/**", "!dist", "!dist/node_modules"]);
});

gulp.task('babel', ['clean'], () =>
    watch('src/**/*.js', { ignoreInitial: false })
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task("copy-node-modules", ["clean-node_modules"], () => {
    return gulp.src("node_modules/**/*")
        .pipe(gulp.dest("dist/node_modules"));
});

gulp.task("build", ["babel"]);
gulp.task("rebuild", ["copy-node-modules", "babel"]);

const serverTask = shell.task('NODE_PATH=. node app.js', { cwd: 'dist' });
gulp.task("server", ["build"], serverTask);
