import path from 'path';
import webpack from 'webpack';
import cssnano from 'cssnano';
import postcss_nesting from 'postcss-nesting';


module.exports = {
  entry: [
    './src/index'
    ],
    output: {
      filename: 'ziltag-plugin.js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/dist/'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, exclude:  /(node_modules|vendor)/, loaders: ['react-hot', 'babel?optional[]=runtime'] },
        { test: /\.css$/, loader: 'style!css!postcss!cssnext' },
        { test: /\.(png|jpg|eot)$/, loader: 'url' }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ],
    postcss: () => {
      return [postcss_nesting, cssnano];
    }
};
