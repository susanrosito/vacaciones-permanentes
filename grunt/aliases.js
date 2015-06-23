module.exports = function() {
    return {
        install: ['npm-install', 'bower-install-simple'],
        lint: {
            description: 'Lint and check style of the JS files',
            tasks: ['jshint', 'jscs']
        },
        run: {
            description: 'Run the server at port 3000',
            tasks: ['compile', 'cwd:target', 'express', 'cwd:current', 'watch']
        },
        test: ['install', 'lint', 'compile', 'copy:test', 'karma'],
        'protractor-server': ['env:test', 'run'],
        protract: ['env:test', 'execute:createDB', 'protractor:notLogged', 'protractor:logged', 'execute:deleteDB'],
        default: ['env:develop', 'run']
    };
};
