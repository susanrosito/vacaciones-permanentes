module.exports = function (grunt, options) {
    return {
        server: {
            files: [{
                expand: true,
                dest: options.target,
                src: [
                    './server.js',
                    'controllers/**',
                    'routes/**',
                    'models/**',
                    'config/**',
                    'locales/**'
                ]
            }]
        },
        assets: {
            files: [{
                expand: true,
                cwd: 'assets/',
                dest: options.target + 'public/',
                src: [
                    'fonts/**',
                    'images/**',
                    'javascripts/**',
                    'partials/**',
                    'styles/**'
                ]
            }, {
                expand: true,
                cwd: 'assets/icons',
                dest: options.target + 'public/',
                src: ['**']
            }]
        },
        vendor: {
            files: [{
                expand: true,
                cwd: options.bower,
                dest: options.target + 'public/vendor/',
                src: ['**']
            }]
        },
        modernizr: {
            files: [{
                expand: true,
                cwd: options.bower + 'modernizr/',
                dest: options.target + 'public/vendor/modernizr/',
                src: ['.bower.json'],
                rename: function (dest, src) {
                    return dest + src.replace('.bower.js', 'bower.js');
                }
            }]
        },
        test: {
            files: [{
                expand: true,
                cwd: options.target,
                dest: options.testTarget,
                src: ['**']
            }]
        }
    };
};