import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import ghPages from 'gulp-gh-pages';
import { argv } from 'yargs';
import env from 'gulp-env';

import webpack_config from './webpack.config';
import common_define from './src/common_define';


gulp.task('clean', (done) => {
  del(['dist']);
  del(['demo/app/dist'], done);
});

gulp.task('serve', ['clean'], () => {
  const dev_webpack_config = Object.assign({}, webpack_config);
  dev_webpack_config.devtool = 'source-map';
  dev_webpack_config.debug = true;
  dev_webpack_config.entry = dev_webpack_config.entry.concat(
    'webpack-dev-server/client?http://localhost:4000',
    'webpack/hot/only-dev-server'
  );
  dev_webpack_config.plugins = dev_webpack_config.plugins.concat(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(Object.assign({}, common_define, {
      SERVER_ADDRESS: JSON.stringify('http://localhost:3000')
    }))
  );

  new WebpackDevServer(webpack(dev_webpack_config), {
    publicPath: dev_webpack_config.output.publicPath,
    contentBase: 'demo/app',
    hot: true,
    historyApiFallback: true
  }).listen(4000, 'localhost', (err, result) => {
    if(err) {
      console.log(err);
    }
    console.log('Listening at localhost:4000');
  });
});

gulp.task('build', ['clean'], (cb) => {
  env({
    vars:{
      NODE_ENV: 'production'
    }
  });
  const pro_webpack_config = Object.assign({}, webpack_config);
  pro_webpack_config.plugins = pro_webpack_config.plugins.concat(
    new webpack.DefinePlugin(Object.assign({}, common_define, {
      SERVER_ADDRESS:
        argv.production
        ? JSON.stringify('http://ziltag.com')
        : JSON.stringify('http://staging.ziltag.com')
    })),
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
