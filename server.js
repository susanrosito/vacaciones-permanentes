
var config = require("./config");

var cors = require("cors"),
    bodyParser = require('body-parser'),
    expressWinston = require('express-winston'),
    browserify = require('browserify-middleware'),
    passport = require('passport');


logger.info("Starting server at port %d", config.port);

logger.info("Connecting to MongoDB at %s", config.mongo.connectionString);
mongoose.connect(config.mongo.connectionString);
logger.info("Database connected");

// Setup express
app.use(cors());

app.use(require("./routes/request_logger.js"));
app.use(require("./routes/assets.js"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Browserify controllers
app.get('/javascripts/controllers.js', browserify("controllers/main.js"));

logger.info("Creating models...");
require("./models/trip.js");
require('./models/user.js');

require('./config/passport');

app.use("/", function(req, res, next){
    res.charset = "utf-8";
    next();
});

logger.info("Creating routes...");
app.use('/trips', require("./routes/trip.js"));
app.use(require("./routes/authentication.js"));

app.use(require("./routes/static_views.js"));
app.use(require("./routes/not_found.js"));

app.use(passport.initialize());

app.use(expressWinston.errorLogger({
    transports: loggerTransports,
    expressFormat: true
}));

// Start the server
app.listen(config.port, function() {
    logger.info("Server started successfully");
});