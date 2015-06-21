module.exports = function (grunt, options) {
    return {
        options: { color: true },
        develop: {
            options: {
                production: false
            }
        }
    };
};