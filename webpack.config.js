import cssnano from 'cssnano';
import postcss_nesting from 'postcss-nesting';

module.exports = {
    output: {
        filename: 'ziltag-plugin.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css!postcss!cssnext' },
            { test: /\.(png|jpg)$/, loader: 'url' }
        ]
    },
    postcss: () => {
        return [postcss_nesting, cssnano];
    }
};
