module.exports = function(grunt) {

    var target = {
        dev: {
            path: 'target/dev/',
            env: 'development'
        },
        deploy: {
            path: 'target/deploy/',
            env: 'production'
        },
        test: {
            path: 'target/test/',
            env: 'test'
        }
    };

    function set(original, key, value) {
        original[key] = value;
        return original;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nunjucks: {
            options: {
                data: {},
                paths: 'views'
            },
            render: {
                files: [{
                    expand: true,
                    cwd: 'views/',
                    src: ['index.html', '404.html'],
                    dest:  target.dev.path + 'public/',
                    ext: '.html'
                }]
            }
        },

        'bower-install-simple': {
            options: {
                color: true
            },
            dev: {
                options: {
                    production: false
                }
            },
            prod: {
                options: {
                    production: true
                }
            }
        },

        copy: {
            dev: {
                files: [
                {
                    expand: true,
                    src: ['./server.js', 'controllers/**', 'routes/**', 'models/**', 'config/**'],
                    dest: target.dev.path
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['fonts/**', 'images/**', 'javascripts/**', 'partials/**', 'styles/**'],
                    dest: target.dev.path + 'public/'
                }, {
                    expand: true,
                    cwd: 'assets/icons',
                    src: ['**'],
                    dest: target.dev.path + 'public/'
                }, {
                    expand: true,
                    cwd: 'bower_components/',
                    src: ['**'],
                    dest: target.dev.path + 'public/vendor/'
                }]
            }
        },

        browserify: {
            compile: {
                files: set({},
                    target.dev.path + '/public/javascripts/controllers.js', ['./angular/app.js']
                )
            }
        },

        //wiredep: {
        //   task: {
        //       src: ['target/**/*.html']
        //   }
        //},

        watch: {
            nunjucks: {
                files: 'views/*',
                tasks: ['nunjucks']
            },
            js: {
                files: ['**/*.js'],
                tasks: ['compile:js']
            },
            html: {
                files: ['**/*.jade'],
                tasks: ['compile:html']
            },
            styles: {
                files: ['**/*.sass'],
                tasks: ['compile:styles']
            }
        },

        express: {
            server: {
                options: {
                    cwd: target.dev.path,
                    server: 'server.js',
                    port: 3000,
                    bases: ['public']
                }
            }
        },

        cwd: {
            current: process.cwd(),
            dev: target.dev.path,
            deploy: target.deploy.path,
            test: target.test.path
        },


        clean: {
            dev: [target.dev.path],
            deploy: [target.deploy.path],
            test: [target.test.path]
        },

        default: ['run']
    });

    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-bower-install-simple');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');

    // grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerMultiTask('cwd', function() {
        if (this.data && this.data !== process.cwd()) {
            process.chdir(this.data);
            grunt.log.writeln('Changing current directory to: ' + this.data);
        }
    });

    grunt.registerTask('install', ['npm-install', 'bower-install-simple']);
    grunt.registerTask('compile', ['nunjucks', 'browserify', 'copy:dev']);
    grunt.registerTask('deploy', ['compile']);
    grunt.registerTask('test', ['compile']);
    grunt.registerTask('run', ['compile', 'cwd:dev', 'express', 'express-keepalive']);
};