module.exports = function() {
    return {
        html: {
            files: 'views/**',
            tasks: ['compile:html']
        },
        assets: {
            files: ['assets/**'],
            tasks: ['compile:assets']
        },
        styles: {
            files: ['styles/**'],
            task: ['compile:styles']
        },
        angular: {
            files: ['angular/**', 'locales/**'],
            tasks: ['compile:angular']
        },
        server: {
            files: ['routes/**', 'models/**', 'config/**', './server.js'],
            tasks: ['compile:server']
        }
    };
};
