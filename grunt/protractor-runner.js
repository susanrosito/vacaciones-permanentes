module.exports = function() {
    return {
        options: {
            configFile: 'tests/integration/protractorConf.js',
            keepAlive: false,
            noColor: false
        },
        notLogged: {
            options: {
                args: {
                    seleniumAddress: 'http://localhost:4444/wd/hub',
                    framework: 'jasmine2',
                    browser: 'chrome',
                    capabilities: {
                        browserName: 'chrome'
                    },
                    specs: ['tests/integration/notLogged/**/*.js']
                }
            }
        },
        logged: {
            options: {
                args: {
                    seleniumAddress: 'http://localhost:4444/wd/hub',
                    framework: 'jasmine2',
                    browser: 'chrome',
                    capabilities: {
                        browserName: 'chrome'
                    },
                    specs: ['tests/integration/logged/**/*.js'],
                    onPrepare: 'tests/integration/logIn.js'
                }
            }
        }
    };
};
