var env = process.env.NODE_ENV || 'development',
    config = require('./config.'+env),
    globals = require("./globals.js");

// set the globals for all the environment
globals(config);
module.exports = config;