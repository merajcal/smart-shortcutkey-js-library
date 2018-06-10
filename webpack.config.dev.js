const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ssjsl.js',
        libraryTarget: 'umd'
    },
    devServer: {
        host: "0.0.0.0",
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: ['raw-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new ProgressBarPlugin()
    ]
};
