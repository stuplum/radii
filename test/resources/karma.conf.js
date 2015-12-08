'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        files: [
            { pattern: './tests.webpack.js', watched: false }
        ],

        exclude: [],

        preprocessors: {
            './tests.webpack.js': ['webpack']
        },

        reporters: ['progress'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['Chrome'],

        singleRun: false,

        concurrency: Infinity,

        webpack: {
            devtool: '#inline-source-map',
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
                ]
            },
            plugins: [

            ],
            watch: true
        },
        webpackServer: {
            noInfo: true
        }

    });

};
