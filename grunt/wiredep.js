module.exports = function (grunt, options) {
    return {
        target: {
            directory: options.target + 'public/vendor',
            src: [options.target + 'public/*.html'],
            overrides: {
                angular: {
                    dependencies: {
                        jquery: '>=2.1'
                    }
                },
                moment: {
                    main: 'min/moment-with-locales.js'
                }
            }
        }
    };
};
