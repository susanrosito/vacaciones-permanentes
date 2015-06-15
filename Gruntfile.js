module.exports = function(grunt) {

    var target = {
        path: 'target/',
        env: 'development'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'bower-install-simple': {
            options: { color: true },
            dev: { options: { production: false } }
        },

        copy: {
            server: { files: [{
                expand: true, dest: target.path,
                src: ['./server.js', 'controllers/**', 'routes/**', 'models/**', 'config/**', 'locales/**']
            }] },
            assets: { files: [{
                expand: true, cwd: 'assets/', dest: target.path + 'public/',
                src: ['fonts/**', 'images/**', 'javascripts/**', 'partials/**', 'styles/**']
            }, {
                expand: true, cwd: 'assets/icons', dest: target.path + 'public/',
                src: ['**']
            }] },
            vendor: { files: [{
                expand: true, cwd: 'bower_components/', dest: target.path + 'public/vendor/',
                src: ['**']
            }] },
            // Needed as modernizr does not provide a bower.json file.
            modernizr: { files: [{
                expand:true, cwd: 'bower_components/modernizr/',
                dest: target.path + 'public/vendor/modernizr/', src: ['.bower.json'],
                rename: function(dest, src) {
                    return dest + src.replace('.bower.js', 'bower.js');
                }
            }] }
        },

        nunjucks: {
            options: { data: {}, paths: 'views' },
            render: { files: [{
                expand: true, cwd: 'views/', ext: '.html',
                src: ['index.html', '404.html'],
                dest:  target.path + 'public/'
            }] }
        },

        browserify: {
            compile: {
                files: { 'target/public/javascripts/controllers.js': ['./angular/app.js'] }
            }
        },

        wiredep: { target: {
            directory: target.path + 'public/vendor',
            src: [target.path + 'public/*.html'],
            // excludes: ['bower_components/lumx/dist/lumx.css'],
            overrides: {
                angular: { dependencies: { jquery : '>=2.1'} },
                moment: { main: 'min/moment-with-locales.js'}
            }
        } },

        compile: {
            server: ['copy:server'],
            angular: ['browserify', 'nggettext_compile'],
            html: ['nunjucks', 'copy:vendor', 'copy:modernizr', 'wiredep'],
            assets: ['copy:assets'],
            styles: ['sass']
        },

        watch: {
            html: { files: 'views/**', tasks: ['compile:html'] },
            assets: { files: ['assets/**'], tasks: ['compile:assets'] },
            styles: { files: ['styles/**'], task: ['compile:styles'] },
            angular: { files: ['angular/**', 'locales/**'], tasks: ['compile:angular'] },
            server: { files: ['routes/**', 'models/**', 'config/**', './server.js'],
                tasks: ['compile:server']
            }
        },

        express: {
            server: { options: {
                livereload: true, expand: true,
                cwd: target.path, server: 'server.js', port: 3000,
                bases: ['public']
            } }
        },

        cwd: {
            current: process.cwd(),
            target: target.path
        },


        clean: {
            target: [target.path]
        },

        nggettext_compile: {
            all: {
                options: {
                    format: 'json'
                },
                files: [
                    {
                        expand: true,
                        src: ['locales/**.po'],
                        dest: target.path + 'public',
                        ext: '.json'
                    }
                ]
            }
        },

        shell: { mongodb: {
            command: 'mongod',
            options: {
                async: true, stdout: false, stderr: true, failOnError: true,
                execOptions: {cwd: '.'}
            } }
        },

        sass: { target: {
            options: {
            // includePaths: require('node-bourbon').with('other/path', 'another/path')
            // - or -
                includePaths:
                    require('node-neat').includePaths.concat([
                        'bower_components/lumx/dist/scss/',
                        'bower_components/sass-mediaqueries/'
                    ])
            },
            files: {
                'target/public/styles/main.css': 'styles/main.scss'
            }
        } },

        jshint: { all: ['Gruntfile.js', 'hello.js'] },

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

    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.loadNpmTasks('grunt-shell-spawn');

    grunt.loadNpmTasks('grunt-sass');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', 'jshint');

    grunt.registerMultiTask('cwd', function() {
        if (this.data && this.data !== process.cwd()) {
            process.chdir(this.data);
            grunt.log.writeln('Changing current directory to: ' + this.data);
        }
    });

    grunt.registerMultiTask('compile', function() {
        grunt.task.run(this.data);
    });

    grunt.registerTask('install', ['npm-install', 'bower-install-simple']);
    grunt.registerTask('run', ['cwd:target', // 'shell:mongodb',
        'express', 'cwd:current','watch']);//,  'express-keepalive']);
};