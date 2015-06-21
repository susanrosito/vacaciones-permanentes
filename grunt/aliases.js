module.exports = function (grunt, options) {
    return {
        lint: {
            description: 'Lint and check style of the JS files',
            tasks: ['jshint', 'jscs']
        },
        run: {
            description: 'Run the server at port 3000',
            tasks: ['compile', 'cwd:target', 'express', 'cwd:current', 'watch']
        },
        test: ['lint', 'compile', 'copy:test', 'cwd:test'],
        default: ['env:develop', 'run']
    };
};
