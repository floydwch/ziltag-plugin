module.exports = {
    output: {
        filename: 'ziltag-plugin.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css' },
        ]
    }
};