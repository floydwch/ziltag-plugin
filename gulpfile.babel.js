import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import webpack from 'webpack-stream';
import merge from 'merge2';


gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('default', ['clean'], function (cb) {
    let index = gulp.src('index.js')
        .pipe(babel());

    let modules = gulp.src('lib/*.js')
        .pipe(babel());

    return merge([index, modules])
        .pipe(webpack({
            module: {
                loaders: [{
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }]}
        }))
        .pipe(gulp.dest('dist'));
});
