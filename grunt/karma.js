module.exports = function(grunt, options) {
    return {
        options: {
            frameworks: ['jasmine'],
            browsers: ['PhantomJS'],
            port: 9876,
            singleRun: true,
            basePath: options.testTarget + 'public',
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
            ]
        },
        angular: {}
    };
};
