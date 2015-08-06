import gulp from 'gulp';

let browserSync = require('browser-sync');
let reload = browserSync.reload;

gulp.task('serve', () => {
    browserSync({
        server: {
            baseDir: 'app'
        },
        open: false
    });

    gulp.watch(
        ['*.html', 'css/*.css', 'js/*.js', 'dist/*'],
        {cwd: 'app'},
        reload
    );
});
