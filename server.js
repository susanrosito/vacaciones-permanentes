
var config = require('./config');

var cors = require('cors'),
    bodyParser = require('body-parser'),
    expressWinston = require('express-winston'),
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

logger.info('Connecting to MongoDB at %s', config.mongo.connectionString);
mongoose.connect(config.mongo.connectionString);
logger.info('Database connected');

require('./models');
require('./config/passport');
require('./routes/');
app.use(passport.initialize());

app.use(expressWinston.errorLogger({
    transports: loggerTransports,
    expressFormat: true
}));

app.listen(config.port, function() {
    logger.info('Express Server started at port: ' + config.port);
});

module.exports = app;
