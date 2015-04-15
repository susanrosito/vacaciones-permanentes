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

    global.auth = jwt({secret: config.auth.secret});

    global.config = config;
};
