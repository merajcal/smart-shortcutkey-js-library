const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ssjsl.min.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin()
    ]
};
