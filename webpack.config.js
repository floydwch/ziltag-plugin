import webpack from 'webpack';
import cssnano from 'cssnano';
import postcss_nesting from 'postcss-nesting';


module.exports = {
    output: {
        filename: 'ziltag-plugin.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude:  /(node_modules|vendor)/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css!postcss!cssnext' },
            { test: /\.(png|jpg|eot)$/, loader: 'url' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        })
    ],
    postcss: () => {
        return [postcss_nesting, cssnano];
    }
};
