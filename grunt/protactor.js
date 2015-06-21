module.exports = function() {
    return {
        options: {
            configFile: 'protractorConf.js', // So "node_modules/protractor/example/conf.js", // Default config file
            keepAlive: false, // If false, the grunt process stops when the test fails.
            noColor: false, // If true, protractor will not use colors in its output.
            args: {
                // Arguments passed to the command
            }
        },
        all: { // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
            options: {
                // The configFile: "e2e.conf.js", // Target-specific config file
                args: {} // Target-specific arguments
            }
        }
    };
};
