import path from 'path'

import webpack from 'webpack'
import postcss_cssnext from 'postcss-cssnext'


module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    filename: 'ziltag-plugin.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude:  /(node_modules|vendor)/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css!postcss' },
      { test: /\.(png|jpg|eot)$/, loader: 'url' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  postcss: () => {
    return [postcss_cssnext]
  }
}
