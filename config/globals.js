var underscore = require('underscore'),
    winston = require('winston'),
    mongoose = require('mongoose'),
    express = require('express'),
    jwt = require('express-jwt');

underscore.str = require('underscore.string');
underscore.mixin(underscore.str.exports());

module.exports = function(config) {

    global._ = underscore;
    global.mongoose = mongoose;
    global.express = express;
    global.app = express();

    // Setup the global logger
    global.loggerTransports = [
        new (winston.transports.Console)({
            colorize: true,
            level: config.log.level
        })
    ];
    global.logger = new (winston.Logger)({
        transports: loggerTransports
    });

    // Set global translations for gettext
    global.translations = require('./translations.js');
    var translator = global.translations('es');
    global.__ = translator.__;
    global._n = translator._n;
    global._x = translator._x;
    global._nx = translator._nx;
    global.setLanguage = function(langId) {
        global.translations.default = 'es';
        translator.setLanguage(langId);
    };

    global.auth = jwt({secret: config.auth.secret});

    global.config = config;
};
