import path from 'path';
import webpack from 'webpack';
import cssnano from 'cssnano';
import postcss_nesting from 'postcss-nesting';


module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './index.js' // Your appʼs entry point
    ],
    output: {
        filename: 'ziltag-plugin.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude:  /(node_modules|vendor)/, loaders: ['react-hot', 'babel'] },
            { test: /\.css$/, loader: 'style!css!postcss!cssnext' },
            { test: /\.(png|jpg|eot)$/, loader: 'url' }
        ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    postcss: () => {
        return [postcss_nesting, cssnano];
    }
};
