const path = require('path');
var fs = require('fs');

var nodeModules = {};

fs
    .readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/server.ts',
    target: 'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: path.resolve(__dirname, './node_modules'),
                loader: 'ts-loader'
            }
        ]
    },
    externals: nodeModules
};
