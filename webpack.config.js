import cssnano from 'cssnano';

module.exports = {
    output: {
        filename: 'ziltag-plugin.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css!postcss!cssnext' },
        ]
    },
    postcss: () => {
        return [cssnano];
    }
};
