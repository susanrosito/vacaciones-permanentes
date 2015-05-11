logger.info(__('Creating trip routes...'));

var Trip = mongoose.model('Trip');

var router = module.exports = express.Router();

router.param('trip', function(req, res, next, id) {
    if (!id.match(/^[a-fA-F0-9]{24}$/)) {
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
    var trip = new Trip(req.body);
    trip.user = req.user;
    trip.save(function(err, trip){
        if(err) { return next(err); }
        res.json(trip);
    });
});

router.get('/:trip', auth, function(req, res) {
    req.trip.populate('destinations', function(err, trip) {
       if (err) { return next(err); }
        var today = new Date();
        var fiveDFromToday = new Date(today);
        var tenFromToday = new Date(today);
        var fifteenFromToday = new Date(today);
        fiveDFromToday.setDate(today.getDate() + 5);
        tenFromToday.setDate(today.getDate() + 10);
        fifteenFromToday.setDate(today.getDate() + 15);
        trip.destinations = [
            {city: 'San Francisco', startDate: today, endDate: fiveDFromToday,
                location: {latitude: 37.771608, longitude: -122.422837}, image: null},
            {city: 'Los Angeles', startDate: fiveDFromToday, endDate: tenFromToday,
                location: {latitude: 34.040416, longitude: -118.240071}, image: null},
            {city: 'Las Vegas', startDate: tenFromToday, endDate: fifteenFromToday,
                location: {latitude: 36.161874, longitude: -115.142728}, image: null}
        ];
        res.json(trip);
    });
});

router.delete('/:trip', auth, function(req, res, next) {
    req.trip.remove(function(err){
        if(err) { return next(err); }
        res.json(req.trip);
    });
});

router.put('/:trip', auth, function(req, res, next){
    req.trip.update(req.body, function(err, trip){
        if(err) { return next(err); }
        res.json(trip);
    });
});
