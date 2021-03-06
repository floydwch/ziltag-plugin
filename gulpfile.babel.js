import gulp from 'gulp'
import del from 'del'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import WebpackDevServer from 'webpack-dev-server'
import ghPages from 'gulp-gh-pages'
import env from 'gulp-env'

import webpack_config from './webpack.config.babel'
import common_define from './src/common_define'


gulp.task('clean', (done) => {
  del(['dist'])
  del(['demo/**/dist'], done)
})

gulp.task('serve', ['clean'], () => {
  const dev_webpack_config = Object.assign({}, webpack_config)
  dev_webpack_config.devtool = 'source-map'
  dev_webpack_config.debug = true
  dev_webpack_config.entry = [...dev_webpack_config.entry,
    `webpack-dev-server/client?http://0.0.0.0:${process.env.PORT || 4000}`,
    'webpack/hot/only-dev-server'
  ]
  dev_webpack_config.plugins = [...dev_webpack_config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(Object.assign({}, common_define, {
      SERVER_ADDRESS: JSON.stringify('http://ziltag.dev'),
      API_ADDRESS: JSON.stringify('http://ziltag.dev')
    }))
  ]

  new WebpackDevServer(webpack(dev_webpack_config), {
    publicPath: dev_webpack_config.output.publicPath,
    contentBase: 'demo/development',
    hot: true,
    historyApiFallback: true
  }).listen(`${process.env.PORT || 4000}`, '0.0.0.0', err => {
    if(err) {
      console.log(err)
    }
    console.log(`Listening at 0.0.0.0:${process.env.PORT || 4000}`)
  })
})

gulp.task('build:staging', ['clean'], () => {
  env({
    vars:{
      NODE_ENV: 'production'
    }
  })
  const pro_webpack_config = Object.assign({}, webpack_config)

  pro_webpack_config.devtool = 'hidden-source-map'
  pro_webpack_config.plugins = [...pro_webpack_config.plugins,
    new webpack.DefinePlugin(Object.assign({}, common_define, {
      SERVER_ADDRESS:
        JSON.stringify('https://staging.ziltag.com'),
      API_ADDRESS:
        JSON.stringify('https://staging.ziltag.com'),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      SENTRY_KEY: JSON.stringify('https://27aa2206191544919e1da664a174c3cb@sentry.io/126292')
    })),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]

  return gulp.src('index.js')
  .pipe(webpackStream(pro_webpack_config, webpack))
  .pipe(gulp.dest('dist'))
  .pipe(gulp.dest('demo/staging/dist'))
})

gulp.task('build:production', ['clean'], () => {
  env({
    vars:{
      NODE_ENV: 'production'
    }
  })
  const pro_webpack_config = Object.assign({}, webpack_config)

  pro_webpack_config.devtool = 'hidden-source-map'
  pro_webpack_config.plugins = [...pro_webpack_config.plugins,
    new webpack.DefinePlugin(Object.assign({}, common_define, {
      SERVER_ADDRESS:
        JSON.stringify('https://ziltag.com'),
      API_ADDRESS:
        JSON.stringify('https://ziltag.com'),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      SENTRY_KEY: JSON.stringify('https://27aa2206191544919e1da664a174c3cb@sentry.io/126292')
    })),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]

  return gulp.src('index.js')
  .pipe(webpackStream(pro_webpack_config, webpack))
  .pipe(gulp.dest('dist'))
  .pipe(gulp.dest('demo/production/dist'))
})

gulp.task('deploy', ['build:staging', 'build:production'], () => {
  return gulp.src('demo/**/**/*', {base: './demo'})
  .pipe(ghPages())
})
