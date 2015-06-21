// Karma configuration
// Generated on Sat Jun 20 2015 22:58:51 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'target-test/public',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'vendor/modernizr/modernizr.js',
        'vendor/jquery/dist/jquery.js',
        'vendor/angular/angular.js',
        'vendor/angular-gettext/dist/angular-gettext.js',
        'vendor/angular-gravatar/build/angular-gravatar.js',
        'vendor/moment/min/moment-with-locales.js',
        'vendor/angular-moment/angular-moment.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angucomplete-alt/angucomplete-alt.js',
        'vendor/velocity/velocity.js',
        'vendor/velocity/velocity.ui.js',
        'vendor/lumx/dist/lumx.js',
        'vendor/ngmap/build/scripts/ng-map.js',
        'vendor/underscore/underscore.js',
        'vendor/underscore.string/dist/underscore.string.js',
        'vendor/angular-mocks/angular-mocks.js',
        'javascripts/controllers.js',
        '../../test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

