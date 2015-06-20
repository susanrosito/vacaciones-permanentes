module.exports = function (grunt, options) {
    return {
        options: {
            data: {},
            paths: 'views'
        },
        render: {
            files: [{
                expand: true,
                cwd: 'views/',
                ext: '.html',
                src: ['index.html', '404.html'],
                dest: options.target + 'public/'
            }]
        }
    };
};