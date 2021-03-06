const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const pkg = require('./package');

const banner =
`${pkg.name} - v${pkg.version} - ${ moment().format('YYYY-MM-DD')}
${pkg.homepage}
Copyright (c) ${ moment().format('YYYY') } ${pkg.author.name}`;

module.exports = {
    entry: './public/js/index.js',
    output: {
        path: path.join(__dirname, './public/js/dist'),
        filename: 'navigator-js.js',
        library: 'navigator-js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /(\.jsx?)$/,
            exclude: /(bower_components|node_modules)/,
            loader: 'babel',
            query: {
                cacheDirectory: true
            }
        }]
    },
    target: 'node',
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
