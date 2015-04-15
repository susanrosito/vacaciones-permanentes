var underscore = require("underscore"),
    winston = require('winston'),
    mongoose = require("mongoose"),
    express = require("express"),
    consolidate = require('consolidate'),
    nunjucks = require('nunjucks'),
    jwt = require('express-jwt');

module.exports = function(config) {
    underscore.str = require('underscore.string');
    underscore.mixin(underscore.str.exports());

    global._ = underscore;
    global.mongoose = mongoose;
    global.express = express;
    global.app = express();

// Set Nunjucks template engine support
    global.app.engine("html", consolidate.nunjucks);
    global.app.set("view engine", "html");
    global.app.set("views", "views");

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