logger.info(__('Creating trip routes...'));

var Trip = mongoose.model('Trip');

var router = module.exports = express.Router();

router.param('trip', function(req, res, next, id) {
    if (ObjectId.isInvalid(id)) {
        return res.error(HTTPStatus.LENGTH_REQUIRED, 'Should be 24 characters long'); }
    Trip.findById(id).exec(function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return res.error(HTTPStatus.NOT_FOUND, 'Can\'t find trip ' + id); }
        req.trip = trip;
        return next();
    });
});

router.all('/:trip*', auth, function(req, res, next) {
    if (req.trip.belongsTo(req.user)) { next(); }
    else { next(new StatusError(HTTPStatus.UNAUTHORIZED, 'Unauthorized')); }
});

router.get('/', auth, function(req, res, next) {
    Trip.find({'user': req.user}, function(err, trips){
        if(err) { return next(err); }
        res.json(trips);
    });
});

router.post('/', auth, function(req, res, next) {
    delete req.body._id;
    var trip = new Trip(req.body);
    trip.user = req.user;
    trip.save(function(err, trip){
        if(err) { return next(err); }
        res.json(trip);
    });
});

router.get('/:trip', auth, function(req, res, next) {
    req.trip.populate('destinations', function(err, trip) {
       if (err) { return next(err); }
        res.json(trip);
    });
});

router.delete('/:trip', auth, function(req, res, next) {
    req.trip.remove(function(err){
        if(err) { return next(err); }
        res.json(req.trip);
    });
});

router.put('/:trip', auth, function(req, res, next) {
    var destinations = req.trip.updateDestinations(req.body);
    logger.info(req.body.destinations);
    req.trip.update({ $pullAll: {destinations: destinations.toRemove }});
    req.trip.update({ $push: {destinations: {$each: destinations.toAdd }}});
    req.trip.update(req.body, function(err, trip){
        if(err) {
            return next(err); }
        logger.info(trip);
        res.json(trip);
    });
});
