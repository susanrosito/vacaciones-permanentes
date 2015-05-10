var underscore = require('underscore'),
    winston = require('winston'),
    mongoose = require('mongoose'),
    express = require('express'),
    http = require('http'),
    jwt = require('express-jwt'),
    HTTPStatus = require('http-status');

underscore.str = require('underscore.string');
underscore.mixin(underscore.str.exports());

module.exports = function(config) {

    global._ = underscore;
    global.mongoose = mongoose;
    global.ObjectId = mongoose.Schema.Types.ObjectId;
    global.express = express;
    global.app = express();
    global.HTTPStatus = HTTPStatus;

    // Set an error response method to the response prototype
    // So you can return standar error responses
    express.response.error = function(statusCode, message) {
        statusCode = statusCode || HTTPStatus.INTERNAL_SERVER_ERROR;
        message = message || '';
        // If there is no code, send basic Error 500
        if (typeof(statusCode) == 'string') {
            message = statusCode;
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        var status = http.STATUS_CODES[statusCode] || String(statusCode);
        return this.status(statusCode).json({
            isError: true,
            statusCode: statusCode,
            status: status,
            message: message
        });
    };

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
