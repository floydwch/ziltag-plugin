import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import ghPages from 'gulp-gh-pages';

import webpack_config from './webpack.config';


gulp.task('clean', (done) => {
  del(['dist']);
  del(['demo/app/dist/ziltag-plugin.js'], done);
});

gulp.task('serve', ['clean'], () => {
  const dev_webpack_config = Object.assign({}, webpack_config);
  dev_webpack_config.devtool = 'source-map';
  dev_webpack_config.debug = true;
  dev_webpack_config.entry.push('webpack-dev-server/client?http://localhost:3000');
  dev_webpack_config.entry.push('webpack/hot/only-dev-server');
  dev_webpack_config.plugins.push(new webpack.HotModuleReplacementPlugin());

  new WebpackDevServer(webpack(dev_webpack_config), {
    publicPath: dev_webpack_config.output.publicPath,
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
  const pro_webpack_config = Object.assign({}, webpack_config);
  pro_webpack_config.plugins = pro_webpack_config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  return gulp.src('index.js')
  .pipe(webpackStream(pro_webpack_config, webpack))
  .pipe(gulp.dest('dist'))
  .pipe(gulp.dest('demo/app/dist'));
});

gulp.task('deploy', ['clean', 'build'], () => {
  return gulp.src('demo/app/**/*')
  .pipe(ghPages());
});

gulp.task('default', ['clean', 'build']);
