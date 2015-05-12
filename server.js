var config = require('./config');

var cors = require('cors'),
    bodyParser = require('body-parser'),
    expressWinston = require('express-winston'),
    errorHandler= require('express-error-handler'),
    passport = require('passport');

app.use(cors());

app.use(require('./routes/request_logger.js'));

app.use(function staticsPlaceholder(req, res, next) {
    return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Set UTF-8 Encoding
app.use('/', function(req, res, next){ res.charset = 'utf-8'; next(); });

logger.info(__('Connecting to MongoDB at %s', config.mongo.connectionString));
mongoose.connect(config.mongo.connectionString);
logger.info(__('Database connected'));

require('./models');
require('./routes');
app.use(passport.initialize());

app.use(expressWinston.errorLogger({
    transports: loggerTransports,
    expressFormat: true
}));

// Handle all the remaining errors
app.use(function(err, req, res) {
    return res.error(HTTPStatus.INTERNAL_SERVER_ERROR, err);
});

module.exports = app;
