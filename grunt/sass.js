module.exports = function(grunt, options) {
    var structure = {
        target: {
            options: {
                includePaths: require('node-neat').includePaths.concat([
                    options.bower + 'lumx/dist/scss/',
                    options.bower + 'sass-mediaqueries/'
                ])
            },
            files: {}
        }
    };
    structure.target.files[options.target + 'public/styles/main.css'] = ['styles/main.scss'];
    return structure;
};
