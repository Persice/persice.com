'use strict';

module.exports = function(config) {

    config.set({
        autoWatch: false,

        // basePath: '.',

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ]
    });
};