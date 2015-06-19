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
            modernizr: { files: [{
                expand: true, cwd: 'bower_components/modernizr/',
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
                dest: target.path + 'public/'
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
            overrides: {
                angular: { dependencies: { jquery: '>=2.1' } },
                moment: { main: 'min/moment-with-locales.js' }
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

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        nggettext_compile: {
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
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
                execOptions: { cwd: '.' }
            } }
        },

        sass: { target: {
            options: {
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

        jshint: {
            options: {
                undef: true,
                unused: true
            },
            angular: {
                options: {
                    browserify: true,
                    browser: true,
                    jquery: true,
                    predef: ['_', 'angular', 'app', 'google', 'moment'] },
                src: ['angular/**/*.js'] },
            config: {
                options: { node: true },
                src: ['config/**/*.js'] },
            models: {
                options: {
                    node: true,
                    predef: ['_', 'mongoose',
                        'ObjectId', 'express', 'app', 'HTTPStatus',
                        'loggerTransports', 'logger', 'translations',
                        '__', '_n', '_x', '_nx', 'setLanguage',
                        'auth', 'config'] },
                src: ['models/**/*.js'] },
            routes: {
                options: {
                    node: true,
                    predef: ['_', 'mongoose',
                        'ObjectId', 'express', 'app', 'HTTPStatus',
                        'loggerTransports', 'logger', 'translations',
                        '__', '_n', '_x', '_nx', 'setLanguage',
                        'auth', 'config', 'StatusError'] },
                src: ['routes/**/*.js'] },
            server: {
                options: {
                    node: true,
                    predef: ['_', 'mongoose',
                        'ObjectId', 'express', 'app', 'HTTPStatus',
                        'loggerTransports', 'logger', 'translations',
                        '__', '_n', '_x', '_nx', 'setLanguage',
                        'auth', 'StatusError'] },
                src: ['server.js', 'Gruntfile.js']
            }
        },

        jscs: {
            options: {
                disallowEmptyBlocks: true,
                disallowMixedSpacesAndTabs: true,
                disallowMultipleLineStrings: true,
                disallowMultipleSpaces: true,
                disallowNewlineBeforeBlockStatements: true,
                disallowQuotedKeysInObjects: true,
                disallowYodaConditions: true,
                maximumLineLength: 120,
                requireCamelCaseOrUpperCaseIdentifiers: true,
                requireCapitalizedComments: true,
                requireCapitalizedConstructors: true,
                requireCommaBeforeLineBreak: true,
                requireCurlyBraces: true,
                requireDollarBeforejQueryAssignment: true,
                requireDotNotation: true,
                requireLineFeedAtFileEnd: true,
                requireParenthesesAroundIIFE: true,
                requireSemicolons: true,
                requireSpaceAfterBinaryOperators: true,
                requireSpaceAfterKeywords: [
                        'if',
                        'for',
                        'while',
                        'return',
                        'do',
                        'else',
                        'switch',
                        'try',
                        'catch',
                        'in',
                        'return',
                        'void'
                    ],
                disallowSpaceAfterKeywords: ['function', 'typeof'],
                requireSpaceAfterLineComment: true,
                disallowSpaceAfterObjectKeys: true,
                requireSpaceBeforeBinaryOperators: true,
                requireSpaceBeforeBlockStatements: true,
                requireSpaceBeforeObjectValues: true,
                requireSpaceBetweenArguments: true,
                requireSpacesInAnonymousFunctionExpression: {
                    beforeOpeningCurlyBrace: true
                },
                requireSpacesInConditionalExpression: true,
                requireSpacesInForStatement: true,
                requireSpacesInsideObjectBrackets: 'all',
                validateAlignedFunctionParameters: true,
                validateIndentation: 4,
                validateParameterSeparator: ', ',
                validateQuoteMarks: true
            },
            routes: ['routes/**/*.js'],
            angular: ['angular/**/*.js'],
            config: ['config/**/*.js'],
            models: ['models/**/*.js'],
            server: ['server.js', 'Gruntfile.js']
        },

        check: {
            routes: ['jshint:routes', 'jscs:routes'],
            angular: ['jshint:angular', 'jscs:angular'],
            config: ['jshint:config', 'jscs:config'],
            models: ['jshint:models', 'jscs:models'],
            server: ['jshint:server', 'jscs:server']
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
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');


    grunt.registerMultiTask('cwd', function() {
        if (this.data && this.data !== process.cwd()) {
            process.chdir(this.data);
            grunt.log.writeln('Changing current directory to: ' + this.data);
        }
    });

    grunt.registerMultiTask('compile', function() {
        grunt.task.run(this.data);
    });

    grunt.registerMultiTask('check', function() {
        grunt.task.run(this.data);
    });

    grunt.registerTask('install', ['npm-install', 'bower-install-simple']);
    grunt.registerTask('run', ['cwd:target', 'express', 'cwd:current', 'watch']);

    grunt.registerTask('test', ['jshint']);
};
