var config = require('./config');

var cors = require('cors'),
    bodyParser = require('body-parser'),
    expressWinston = require('express-winston'),
    passport = require('passport');

app.use(cors());

app.use(require('./routes/request_logger.js'));

if (config.env == 'production') {
    app.use(express.static(__dirname + '/public'));
} else {
    // jscs:disable disallowSpaceAfterKeywords
    app.use(function staticsPlaceholder(req, res, next) {
        return next();
    });
    // jscs:enable disallowSpaceAfterKeywords
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set UTF-8 Encoding
app.use('/', function(req, res, next) { res.charset = 'utf-8'; next(); });

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

if (config.env == 'production') {
    app.listen(config.port, function() {
        logger.info('Running on port: ' + config.port);
    });
}
