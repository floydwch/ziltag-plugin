import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import ghPages from 'gulp-gh-pages';

import webpackConfig from './webpack.config';


gulp.task('clean', (cb) => {
    del(['dist']);
    del(['demo/app/dist/ziltag-plugin.js'], cb);
});

gulp.task('serve', ['clean'], () => {
    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        contentBase: 'demo/app',
        hot: true,
        historyApiFallback: true
    }).listen(3000, 'localhost', (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log('Listening at localhost:3000');
    });
});

gulp.task('build', ['clean'], (cb) => {
    return gulp.src('index.js')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo/app/dist'));
});

gulp.task('deploy', ['clean', 'build'], () => {
    return gulp.src('demo/app/**/*')
        .pipe(ghPages());
});

gulp.task('default', ['clean', 'build']);
