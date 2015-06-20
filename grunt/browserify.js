module.exports = function (grunt, options) {
    var structure = { target: { files: {} } };
    structure.target.files[options.target + 'public/javascripts/controllers.js'] = ['./angular/app.js'];
    return structure;
};
