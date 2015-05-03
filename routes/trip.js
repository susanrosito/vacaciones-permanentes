logger.info(__('Creating trip routes...'));

var Trip = mongoose.model('Trip');

var router = module.exports = express.Router();

router.param('trip', function(req, res, next, id) {
    var query = Trip.findById(id);

    query.exec(function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return next(new Error('can\'t find trip')); }

        req.trip = trip;
        return next();
    });
});

router.all('/:trip*', auth, function(req, res, next) {
    if (req.trip.author === req.user.username) {
        next();
    } else {
        res.status(401).send({status: 401, message: 'Unauthorized'});
    }
});

router.get('/', auth, function(req, res, next) {
    Trip.find(function(err, trips){
        if(err){ return next(err); }
        res.json(trips);
    }).where('author', req.user.username);
});

router.post('/', auth, function(req, res, next) {
    var trip = new Trip(req.body);
    trip.author = req.user.username;

    trip.save(function(err, trip){
        if(err){ return next(err); }
        res.json(trip);
    });
});

router.get('/:trip', auth, function(req, res) {
    // populate with locations in the future
    //req.trip.populate('locations', function(err, trip) {
    //   if (err) { return next(err); }
        res.json(req.trip);
    //});
});

router.delete('/:trip', auth, function(req, res) {
    req.trip.remove(function(err){
        if(err){ return next(err); }
        res.json({
            status: 200,
            message: 'Success'
        });
    });
});

router.put('/:trip', auth, function(req, res, next){
    var trip = req.trip;

    trip.update(req.body, function(err, trip){
        if(err){return next(err); }
        res.json(trip);
    });

});
