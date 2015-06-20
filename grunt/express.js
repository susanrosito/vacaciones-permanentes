module.exports = function (grunt, options) {
    return {
        server: {
            options: {
                livereload: true,
                expand: true,
                cwd: options.target,
                server: 'server.js',
                port: 3000,
                bases: ['public']
            }
        }
    };
};