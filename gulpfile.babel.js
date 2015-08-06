import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import webpack from 'webpack-stream';
import merge from 'merge2';

import webpack_config from './webpack.config.js';


gulp.task('clean', (cb) => {
    del(['dist']);
    del(['demo/app/dist/ziltag-plugin.js'], cb);
});

gulp.task('build', ['clean'], (cb) => {
    let index = gulp.src('index.js')
        .pipe(babel());

    let modules = gulp.src('lib/*.js')
        .pipe(babel());

    return merge([index, modules])
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo/app/dist'));
});

gulp.task('watch', () =>  {
    gulp.watch(['index.js', 'index.css', 'lib/*'], ['build']);
});

gulp.task('default', ['clean', 'build', 'watch']);
