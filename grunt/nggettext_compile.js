module.exports = function (grunt, options) {
    return {
        all: {
            options: {format: 'json'},
            files: [{
                expand: true,
                src: ['locales/**.po'],
                dest: options.target + 'public',
                ext: '.json'
            }]
        }
    };
};
