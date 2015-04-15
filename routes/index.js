logger.info('Creating routes...');

app.use('/trips', require('./trip.js'));
app.use(require('./authentication.js'));
app.use(require('./not_found.js'));

module.exports = {};
