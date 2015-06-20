module.exports = function(grunt) {

    grunt.registerMultiTask('cwd', function() {
        if (this.data && this.data !== process.cwd()) {
            process.chdir(this.data);
            grunt.log.writeln('Changing current directory to: ' + this.data);
        }
    });

    grunt.registerMultiTask('compile', function() {
        grunt.task.run(this.data);
    });

    require('load-grunt-config')(grunt, {
        data: {
            target: 'TARGETTO/',
            bower: 'bower_components/'
        },
        preMerge: function(config, data) {
            config.cwd = {
                current: process.cwd(),
                target: data.target
            };
            config.compile = {
                server: ['copy:server'],
                angular: ['browserify', 'nggettext_compile'],
                html: ['nunjucks', 'copy:vendor', 'copy:modernizr', 'wiredep'],
                assets: ['copy:assets'],
                styles: ['sass']
            };
        }
    });
};
