import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import webpack from 'webpack-stream';
import merge from 'merge2';


gulp.task('clean', (cb) => {
    del(['dist']);
    del(['demo/app/dist/ziltag-plugin.js'], cb);
});

gulp.task('default', ['clean'], (cb) => {
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
            }]},
            output: {
                filename: 'ziltag-plugin.js'
            }
        }))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo/app/dist'));
});
