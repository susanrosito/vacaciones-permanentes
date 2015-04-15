logger.info("Creating trip routes...");

var router = express.Router();

var Trip = mongoose.model("Trip");

router.param('trip', function(req, res, next, id) {
    var query = Trip.findById(id);

    query.exec(function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return next(new Error('can\'t find trip')); }

        req.trip = trip;
        return next();
    });
});

router.get('/', function(req, res, next) {
    Trip.find(function(err, trips){
        if(err){ return next(err); }
        res.json(trips);
    });
});

router.post('/', auth, function(req, res, next) {
    var trip = new Trip(req.body);
    trip.author = req.user.username;

    trip.save(function(err, trip){
        if(err){ return next(err); }
        res.json(trip);
    });
});

router.get('/:trip', function(req, res) {
    // populate with locations in the future
    //req.trip.populate('locations', function(err, trip) {
    //   if (err) { return next(err); }
        res.json(req.trip);
    //});
});

router.delete('/:trip', function(req, res) {
    req.trip.delete(function(err){
        if(err){ return next(err); }
        res.json({status: "Success"});
    })
});

module.exports = router;